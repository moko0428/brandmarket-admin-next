'use client';

import { useState, useCallback } from 'react';

interface UploadImageArgs {
  file: File;
  storeId: string;
}

interface UploadImageResult {
  publicUrl: string;
}

export const useImageUploadMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      args: UploadImageArgs,
      options?: {
        onSuccess?: (data: UploadImageResult) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', args.file);
        formData.append('storeId', args.storeId);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '업로드 실패');
        }

        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('업로드 실패');
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
