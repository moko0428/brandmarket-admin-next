'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import Image from 'next/image';
import { UserIcon, Upload, X } from 'lucide-react';
import { browserClient } from '@/lib/supabase/client';

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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이미지 URL 정규화
  const normalizedImageUrl =
    currentImageUrl &&
    currentImageUrl.trim() !== '' &&
    currentImageUrl !== 'null' &&
    currentImageUrl !== 'undefined' &&
    currentImageUrl.startsWith('http')
      ? currentImageUrl
      : null;

  // 실제 표시할 이미지 URL (미리보기가 있으면 미리보기, 없으면 현재 이미지)
  const displayImageUrl = previewUrl || normalizedImageUrl;

  // 프로필 데이터 강제 새로고침
  const refreshProfileData = useCallback(async () => {
    try {
      const supabase = browserClient();
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('avatar')
        .eq('profile_id', profileId)
        .single();

      if (updatedProfile?.avatar) {
        console.log('프로필 데이터 새로고침 완료:', updatedProfile.avatar);
      }
    } catch (error) {
      console.error('프로필 데이터 새로고침 에러:', error);
    }
  }, [profileId]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !profileId) return;

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 허용된 형식 검증
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('JPG, PNG, WebP 형식만 업로드 가능합니다.');
        return;
      }

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      setUploading(true);

      try {
        // FormData 생성
        const formData = new FormData();
        formData.append('file', file);
        formData.append('profileId', profileId);

        // API 호출
        const response = await fetch('/api/profile', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '이미지 업로드에 실패했습니다.');
        }

        // 성공 처리 - 콜백 호출로 부모 컴포넌트 상태 업데이트
        onImageUploaded(data.publicUrl);
        setPreviewUrl(null); // 미리보기 제거

        // 추가: 프로필 데이터 강제 새로고침
        await refreshProfileData();

        toast.success('프로필 이미지가 업로드되었습니다.');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '업로드 실패';
        toast.error(errorMessage);
        setPreviewUrl(null); // 에러 시 미리보기 제거
        console.error('프로필 이미지 업로드 에러:', error);
      } finally {
        setUploading(false);
        // 파일 입력 초기화
        e.target.value = '';
      }
    },
    [profileId, onImageUploaded, refreshProfileData]
  );

  // 미리보기 취소
  const handleCancelPreview = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  // 이미지 제거
  const handleRemoveImage = useCallback(async () => {
    if (!profileId) return;

    try {
      const supabase = browserClient();
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: null })
        .eq('profile_id', profileId);

      if (error) {
        throw error;
      }

      onImageUploaded(''); // 빈 문자열로 업데이트
      toast.success('프로필 이미지가 제거되었습니다.');
    } catch (error) {
      console.error('이미지 제거 에러:', error);
      toast.error('이미지 제거 중 오류가 발생했습니다.');
    }
  }, [profileId, onImageUploaded]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프로필 이미지 미리보기 */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt="프로필 이미지"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              key={`${displayImageUrl}-${Date.now()}`} // 강제 리렌더링
              unoptimized={displayImageUrl.includes('supabase')}
              priority={true} // 우선 로딩
              onLoad={() => {
                console.log('이미지 로드 완료:', displayImageUrl);
              }}
              onError={(e) => {
                console.error('이미지 로드 실패:', displayImageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // 부모 요소에 기본 아이콘 표시
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <UserIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* 미리보기 상태일 때 취소 버튼 */}
        {previewUrl && (
          <button
            onClick={handleCancelPreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 로딩 오버레이 */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-xs">업로드 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* 업로드 정보 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">프로필 사진</h3>
        <p className="text-sm text-gray-500 mt-1">
          JPG, PNG, WebP 형식 (최대 5MB)
        </p>
      </div>

      {/* 버튼들 */}
      <div className="flex gap-2">
        {/* 파일 업로드 버튼 */}
        <div className="relative">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled || uploading}
          />
          <Button
            variant="default"
            size="sm"
            disabled={disabled || uploading}
            className="pointer-events-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? '업로드 중...' : '사진 업로드'}
          </Button>
        </div>

        {/* 이미지 제거 버튼 */}
        {normalizedImageUrl && !previewUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={disabled || uploading}
          >
            <X className="w-4 h-4 mr-2" />
            제거
          </Button>
        )}
      </div>

      {/* 디버그 정보 (개발 중에만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-2">
          <p>현재 이미지: {normalizedImageUrl ? '있음' : '없음'}</p>
          <p>미리보기: {previewUrl ? '있음' : '없음'}</p>
        </div>
      )}

      {/* 업로드 팁 */}
      <div className="text-xs text-gray-400 text-center max-w-xs">
        <p>• 정사각형 이미지가 가장 좋습니다</p>
        <p>• 얼굴이 중앙에 오도록 촬영해주세요</p>
      </div>
    </div>
  );
}
