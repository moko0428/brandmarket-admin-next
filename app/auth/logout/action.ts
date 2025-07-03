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
    redirect('/');
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

export async function deleteAccountAction() {
  try {
    const supabase = await serverClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: '사용자 정보를 가져올 수 없습니다.' };
    }

    // 계정 삭제
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id
    );
    if (deleteError) {
      return { error: '계정 삭제 중 오류가 발생했습니다.' };
    }

    // 로그아웃
    await supabase.auth.signOut();

    // 메인 페이지로 이동
    redirect('/?message=회원탈퇴가 완료되었습니다.');
  } catch (error) {
    console.error('회원탈퇴 처리 중 오류:', error);
    return { error: '회원탈퇴 처리 중 오류가 발생했습니다.' };
  }
}
