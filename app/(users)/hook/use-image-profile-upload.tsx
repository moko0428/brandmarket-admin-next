import { useMutation } from '@tanstack/react-query';

interface UploadProfileImageArgs {
  file: File;
  profileId: string;
}

interface UploadProfileImageResult {
  publicUrl: string;
}

export const useProfileImageUploadMutation = () => {
  return useMutation<UploadProfileImageResult, Error, UploadProfileImageArgs>({
    mutationFn: async ({ file, profileId }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('profileId', profileId);

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '프로필 이미지 업로드 실패');
      }

      return data;
    },
  });
};
