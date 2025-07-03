'use server';

import { signupSchema } from '@/lib/schemas';
import { serverClient } from '@/lib/supabase/server';
import { generateOTP, sendOTPEmail } from '../lib/email';
import { OTPStore } from '../store/otp-store';

// OTP 전송 액션
export async function sendOTPAction(
  prevState: { error: string; success?: boolean; email?: string },
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const password_confirm = formData.get('password_confirm') as string;

    // 기본 유효성 검사
    const validationResult = signupSchema.safeParse({
      location_name: name,
      email,
      password,
      password_confirm,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return { error: firstError || '입력값을 확인해주세요.' };
    }

    const supabase = await serverClient();

    // 이메일 중복 확인 (Supabase가 자동으로 처리하지만 미리 확인)
    const { data: existingUsers, error: listError } = await supabase.auth.admin
      .listUsers()
      .catch(() => ({ data: { users: [] }, error: null }));

    if (!listError && existingUsers?.users) {
      const emailExists = existingUsers.users.some(
        (user) => user.email === email
      );
      if (emailExists) {
        return { error: '이미 가입된 이메일입니다.' };
      }
    }

    // OTP 생성
    const otp = generateOTP();

    // OTP 저장
    OTPStore.set(email, otp, { name, email, password });

    // 이메일 전송
    const emailResult = await sendOTPEmail(email, otp, name);

    if (!emailResult.success) {
      return { error: '인증 코드 전송에 실패했습니다. 다시 시도해주세요.' };
    }

    return { error: '', success: true, email };
  } catch (error) {
    console.error('OTP 전송 처리 중 오류:', error);
    return { error: '인증 코드 전송 중 오류가 발생했습니다.' };
  }
}

// OTP 확인 및 회원가입 완료 액션
export async function verifyOTPAction(
  prevState: { error: string; success?: boolean },
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;

    if (!email || !otp) {
      return { error: '이메일과 인증 코드를 입력해주세요.' };
    }

    // 저장된 OTP 확인
    const storedData = OTPStore.get(email);
    if (!storedData) {
      return { error: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
    }

    if (storedData.otp !== otp) {
      return { error: '인증 코드가 올바르지 않습니다.' };
    }

    // OTP 확인 완료 후 회원가입 진행
    const supabase = await serverClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: storedData.userData.email,
      password: storedData.userData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          location_name: storedData.userData.name.trim(),
          role: 'user',
        },
      },
    });

    if (authError) {
      console.error('회원가입 에러:', authError);

      if (authError.message.includes('already registered')) {
        return { error: '이미 가입된 이메일입니다.' };
      }

      return { error: authError.message || '회원가입 중 오류가 발생했습니다.' };
    }

    if (authData.user) {
      // OTP 삭제
      OTPStore.delete(email);

      // 성공적으로 회원가입 완료
      return {
        error: '',
        success: true,
        message: '회원가입이 완료되었습니다!',
      };
    }

    return { error: '회원가입 중 오류가 발생했습니다.' };
  } catch (error) {
    console.error('OTP 확인 중 오류:', error);
    return { error: '인증 코드 확인 중 오류가 발생했습니다.' };
  }
}

// 이메일 재전송 액션
export async function resendEmailAction(
  prevState: { error: string; success?: boolean },
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    if (!email || !name) {
      return { error: '이메일과 이름이 필요합니다.' };
    }

    // 새로운 OTP 생성
    const otp = generateOTP();

    // 기존 데이터 가져오기 (실제로는 더 안전한 방법 사용)
    const storedData = OTPStore.get(email);
    if (!storedData) {
      return { error: '인증 정보를 찾을 수 없습니다. 다시 시도해주세요.' };
    }

    // 새로운 OTP 저장
    OTPStore.set(email, otp, storedData.userData);

    // 이메일 재전송
    const emailResult = await sendOTPEmail(email, otp, name);

    if (!emailResult.success) {
      return { error: '인증 코드 재전송에 실패했습니다.' };
    }

    return { error: '', success: true };
  } catch (error) {
    console.error('이메일 재전송 처리 중 오류:', error);
    return { error: '이메일 재전송 처리 중 오류가 발생했습니다.' };
  }
}
