'use server';

import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';

interface State {
  error: string;
}

export async function loginAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해주세요.' };
  }

  const { error } = await (
    await serverClient()
  ).auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('error', error);

    // Supabase 로그인 에러 한글화
    if (error.code === 'email_not_confirmed') {
      return { error: '이메일이 확인되지 않았습니다. 이메일을 확인해주세요.' };
    }

    if (error.code === 'invalid_credentials') {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    if (error.code === 'user_not_found') {
      return { error: '등록되지 않은 이메일입니다.' };
    }

    if (error.code === 'too_many_requests') {
      return {
        error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
      };
    }

    if (error.message.includes('Invalid login credentials')) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    return { error: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' };
  }

  redirect('/');
}
