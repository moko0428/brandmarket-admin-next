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

    // 이메일 미확인 에러 처리
    if (error.code === 'email_not_confirmed') {
      return { error: '이메일이 확인되지 않았습니다. 이메일을 확인해주세요.' };
    }

    return { error: error.message || '로그인 중 오류가 발생했습니다.' };
  }
  console.log('success', email, password);
  redirect('/profile');
}
