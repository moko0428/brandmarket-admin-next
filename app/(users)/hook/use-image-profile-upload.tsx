'use client';

import { useState, useCallback } from 'react';

interface UploadProfileImageArgs {
  file: File;
  profileId: string;
}

interface UploadProfileImageResult {
  publicUrl: string;
}

export const useProfileImageUploadMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      args: UploadProfileImageArgs,
      options?: {
        onSuccess?: (data: UploadProfileImageResult) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', args.file);
        formData.append('profileId', args.profileId);

        const res = await fetch('/api/profile', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '프로필 이미지 업로드 실패');
        }

        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('프로필 이미지 업로드 실패');
        setError(error.message);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    mutate,
    isPending: loading,
    error,
  };
};
