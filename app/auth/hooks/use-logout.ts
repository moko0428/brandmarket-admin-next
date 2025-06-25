'use client';

import { useActionState, useState, useEffect, startTransition } from 'react';
import { toast } from 'sonner';
import { logoutAction } from '../logout/action';

export function useLogout() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, formAction] = useActionState(logoutAction, {
    error: '',
  });

  const openLogoutDialog = () => {
    setIsDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    startTransition(() => {
      formAction();
    });
  };

  // useEffect로 에러 처리
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  return {
    isDialogOpen,
    openLogoutDialog,
    closeLogoutDialog,
    handleLogout,
  };
}
