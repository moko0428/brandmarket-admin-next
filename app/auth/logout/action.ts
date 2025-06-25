'use server';

import { serverClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface NextRedirectError extends Error {
  digest?: string;
}

export async function logoutAction() {
  try {
    const supabase = await serverClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase 로그아웃 에러:', error);
      return { error: `로그아웃 실패: ${error.message}` };
    }

    // NEXT_REDIRECT는 정상적인 동작이므로 에러로 처리하지 않음
    redirect('/auth/login');
  } catch (error) {
    const nextError = error as NextRedirectError;

    if (nextError?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('로그아웃 처리 중 예상치 못한 에러:', error);

    // 실제 에러만 처리
    if (error instanceof Error) {
      return { error: `로그아웃 실패: ${error.message}` };
    } else {
      return { error: '로그아웃 처리 중 알 수 없는 오류가 발생했습니다.' };
    }
  }
}
