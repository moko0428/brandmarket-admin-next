'use server';

import { signupSchema } from '@/lib/schemas';
import { serverClient } from '@/lib/supabase/server';

// OTP 저장용 (실제로는 Redis나 데이터베이스 사용)
const otpStore = new Map<
  string,
  {
    otp: string;
    expires: number;
    userData: { name: string; email: string; password: string };
  }
>();

// OTP 생성 함수
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    // OTP 생성 및 저장
    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5분 유효
    otpStore.set(email, {
      otp,
      expires,
      userData: { name, email, password },
    });

    // 개발 환경에서는 콘솔에 출력
    console.log(`📧 OTP for ${email}: ${otp}`);

    // 실제 프로덕션에서는 Supabase Edge Functions나 외부 이메일 서비스 사용
    // 여기서는 개발용으로 콘솔 출력만 함

    return { error: '', success: true, email };
  } catch (error) {
    console.error('OTP 전송 중 오류:', error);
    return { error: '인증 코드 전송 중 오류가 발생했습니다.' };
  }
}

// OTP 확인만 하는 액션
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
    const storedData = otpStore.get(email);
    if (!storedData) {
      return { error: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return { error: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
    }

    if (storedData.otp !== otp) {
      return { error: '인증 코드가 올바르지 않습니다.' };
    }

    // OTP 확인 완료 (회원가입은 하지 않음)
    otpStore.delete(email);

    return {
      error: '',
      success: true,
      message: '이메일 인증이 완료되었습니다.',
    };
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
    const storedData = otpStore.get(email);
    if (!storedData) {
      return { error: '인증 정보를 찾을 수 없습니다. 다시 시도해주세요.' };
    }

    // 새로운 OTP 저장
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5분 유효
      userData: storedData.userData,
    });

    // 이메일 재전송
    // 실제 프로덕션에서는 Supabase Edge Functions나 외부 이메일 서비스 사용
    // 여기서는 개발용으로 콘솔 출력만 함

    return { error: '', success: true };
  } catch (error) {
    console.error('이메일 재전송 처리 중 오류:', error);
    return { error: '이메일 재전송 처리 중 오류가 발생했습니다.' };
  }
}

// 회원가입 액션 (이메일 인증 완료 후)
export async function signupAction(
  prevState: { error: string; success?: boolean; message?: string },
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

    // 회원가입 진행
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          location_name: name.trim(),
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
      // 프로필 생성
      const { error: profileError } = await supabase.from('profiles').insert({
        profile_id: authData.user.id,
        location_name: name.trim(),
        role: 'user',
        avatar: null,
      });

      if (profileError) {
        console.error('프로필 생성 에러:', profileError);
        // 프로필 생성 실패해도 회원가입은 성공으로 처리
      }

      return {
        error: '',
        success: true,
        message: '회원가입이 완료되었습니다!',
      };
    }

    return { error: '회원가입 중 오류가 발생했습니다.' };
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error);
    return { error: '회원가입 처리 중 오류가 발생했습니다.' };
  }
}
