// lib/hooks/useImageUploadMutation.ts
import { useMutation } from '@tanstack/react-query';

interface UploadImageArgs {
  file: File;
  storeId: string;
}

interface UploadImageResult {
  publicUrl: string;
}

export const useImageUploadMutation = () => {
  return useMutation<UploadImageResult, Error, UploadImageArgs>({
    mutationFn: async ({ file, storeId }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('storeId', storeId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '업로드 실패');
      }

      return data;
    },
  });
};
