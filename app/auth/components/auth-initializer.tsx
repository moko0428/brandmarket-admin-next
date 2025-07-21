'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { checkAuthAtom } from '@/app/auth/atoms/authAtom';

export function AuthInitializer() {
  const checkAuth = useSetAtom(checkAuthAtom);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
