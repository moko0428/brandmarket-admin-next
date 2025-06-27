'use client';

import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import Image from 'next/image';
import { useProfileImageUploadMutation } from '../../hook/use-image-profile-upload';

interface ProfileImageUploaderProps {
  profileId: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  disabled?: boolean;
}

export function ProfileImageUploader({
  profileId,
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: ProfileImageUploaderProps) {
  const uploadMutation = useProfileImageUploadMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(
      { file, profileId: profileId },
      {
        onSuccess: ({ publicUrl }) => {
          onImageUploaded(publicUrl);
          toast.success('이미지가 업로드되었습니다.');
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h2>프로필 사진</h2>
      <Input
        type="file"
        className="hidden"
        id="profile"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploadMutation.isPending}
      />
      <label htmlFor="profile">
        <Button
          variant="outline"
          className="w-full h-full"
          type="button"
          disabled={disabled || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              업로드 중...
            </div>
          ) : (
            <Image
              src={
                currentImageUrl && currentImageUrl.startsWith('http')
                  ? currentImageUrl
                  : '/brandmarket_logo.png'
              }
              alt="profile"
              width={100}
              height={100}
              className="w-[100px] h-[100px] object-cover bg-gray-200"
            />
          )}
        </Button>
      </label>
      <Button
        variant="outline"
        className="w-full"
        asChild
        type="button"
        disabled={disabled || uploadMutation.isPending}
      >
        <label htmlFor="profile">
          {uploadMutation.isPending ? '업로드 중...' : '프로필 사진 변경하기'}
        </label>
      </Button>
    </div>
  );
}
