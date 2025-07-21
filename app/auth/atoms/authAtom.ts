// atoms/authAtom.ts
import { atom } from 'jotai';
import { User } from '@supabase/supabase-js';
import { browserClient } from '@/lib/supabase/client';

// 인증 상태를 저장할 atom 생성
export const authAtom = atom<User | null>(null);

// 로딩 상태를 저장할 atom
export const authLoadingAtom = atom<boolean>(true);

// 인증 상태를 업데이트하는 atom
export const authUpdateAtom = atom(
  (get) => get(authAtom),
  async (get, set) => {
    try {
      set(authLoadingAtom, true);
      const supabase = browserClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('인증 상태 확인 중 오류:', error);
        set(authAtom, null);
      } else {
        set(authAtom, user);
      }
    } catch (error) {
      console.error('인증 상태 업데이트 중 오류:', error);
      set(authAtom, null);
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// 로그인 함수 atom
export const signInAtom = atom(
  null,
  async (
    get,
    set,
    { email, password }: { email: string; password: string }
  ) => {
    try {
      set(authLoadingAtom, true);
      const supabase = browserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      set(authAtom, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('로그인 중 오류:', error);
      return { success: false, error };
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// 로그아웃 함수 atom
export const signOutAtom = atom(null, async (get, set) => {
  try {
    set(authLoadingAtom, true);
    const supabase = browserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    set(authAtom, null);
    return { success: true };
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
    return { success: false, error };
  } finally {
    set(authLoadingAtom, false);
  }
});

// 인증 상태 확인 함수 atom
export const checkAuthAtom = atom(null, async (get, set) => {
  try {
    set(authLoadingAtom, true);
    const supabase = browserClient();

    // 현재 세션 확인
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('세션 확인 중 오류:', sessionError);
      set(authAtom, null);
      return;
    }

    if (session?.user) {
      set(authAtom, session.user);
    } else {
      set(authAtom, null);
    }
  } catch (error) {
    console.error('인증 상태 확인 중 오류:', error);
    set(authAtom, null);
  } finally {
    set(authLoadingAtom, false);
  }
});
