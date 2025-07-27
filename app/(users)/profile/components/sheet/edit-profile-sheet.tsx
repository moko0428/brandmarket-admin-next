'use client';

import { Hero } from '@/common/components/hero';
import { ProfileImageUploader } from '../profile-image-uploader';
import { Separator } from '@/common/components/ui/separator';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { updateProfile } from '@/app/(users)/profile/action';
import { toast } from 'sonner';
import { browserClient } from '@/lib/supabase/client';
import { Tables } from '@/database.types';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/common/components/ui/sheet';
import type { User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  user: User;
  onProfileUpdate?: () => void;
}

export default function EditProfileSheet({
  open,
  onOpenChange,
  profile: initialProfile,
  user,
  onProfileUpdate,
}: EditProfileSheetProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [avatar, setAvatar] = useState<string>('');

  // 프로필 데이터 초기화
  useEffect(() => {
    if (initialProfile) {
      setLocationName(initialProfile.location_name || '');
      setAvatar(initialProfile.avatar || '');
    }
  }, [initialProfile]);

  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const result = await updateProfile(user.id, {
        location_name: locationName,
        avatar: avatar,
      });

      if (result.error) {
        toast.error(`저장 실패: ${result.error}`);
      } else {
        toast.success('프로필이 저장되었습니다.');
        onProfileUpdate?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('프로필 저장 에러:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }, [user?.id, locationName, avatar, onProfileUpdate, onOpenChange]);

  const handleAvatarUpload = useCallback(
    (imageUrl: string) => {
      setAvatar(imageUrl);
      // 즉시 프로필 업데이트를 위해 호출
      onProfileUpdate?.();
    },
    [onProfileUpdate]
  );

  const handleLogout = async () => {
    try {
      const supabase = browserClient();
      await supabase.auth.signOut();
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader className="hidden">
        <SheetTitle>프로필 수정</SheetTitle>
        <SheetDescription>프로필을 수정할 수 있습니다.</SheetDescription>
      </SheetHeader>
      <SheetContent className="w-full max-w-2xl mx-auto px-10 py-10 overflow-y-auto">
        <Hero
          title="프로필 수정"
          subtitle="프로필 정보를 수정할 수 있습니다."
        />

        <div className="space-y-8 mt-6">
          {/* 프로필 이미지 업로더 */}
          <ProfileImageUploader
            profileId={user.id}
            currentImageUrl={avatar}
            onImageUploaded={handleAvatarUpload}
            disabled={saving}
          />

          <Separator />

          {/* 사용자 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationName">이름</Label>
              <Input
                id="locationName"
                placeholder="이름을 입력해주세요"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>역할</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm">
                  {initialProfile.role === 'admin'
                    ? '점장'
                    : initialProfile.role === 'manager'
                    ? '매니저'
                    : '일반 사용자'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>가입일</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-700">
                  {new Date(initialProfile.createdAt).toLocaleDateString(
                    'ko-KR'
                  )}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 버튼들 */}
          <div className="space-y-3">
            <Button
              onClick={handleSaveProfile}
              className="w-full"
              disabled={!locationName.trim() || saving}
            >
              {saving ? '저장 중...' : '프로필 저장'}
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              disabled={saving}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
