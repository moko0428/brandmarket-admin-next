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
    return { error: error.message };
  }
  console.log('success', email, password);
  redirect('/profile');
}
