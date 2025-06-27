'use client';

import { Hero } from '@/common/components/hero';
import { ProfileImageUploader } from './components/profile-image-uploader';
import { Separator } from '@/common/components/ui/separator';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from './action';
import { toast } from 'sonner';
import { browserClient } from '@/lib/supabase/client';
import { Tables } from '@/database.types';

type Profile = Tables<'profiles'>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // 현재 사용자 ID 가져오기 (미들웨어에서 이미 인증 확인됨)
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = browserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUserId) return;

      try {
        const profileData = await getProfile(currentUserId);
        if (profileData) {
          setProfile(profileData);
          setLocationName(profileData.location_name || '');
          setAvatar(profileData.avatar);
        }
      } catch (error) {
        console.error('프로필 데이터 로드 에러:', error);
        toast.error('프로필 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUserId]);

  const handleSaveProfile = async () => {
    if (!currentUserId) return;

    try {
      const result = await updateProfile(currentUserId, {
        location_name: locationName,
        avatar: avatar || '',
      });

      if (result.error) {
        toast.error(`저장 실패: ${result.error}`);
      } else {
        toast.success('프로필이 저장되었습니다.');
        // 프로필 데이터 다시 로드
        const updatedProfile = await getProfile(currentUserId);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }
    } catch {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleAvatarUpload = (imageUrl: string) => {
    setAvatar(imageUrl);
  };

  if (loading) {
    return (
      <div className="px-5 h-[calc(100vh-100px)] flex items-center justify-center">
        <div>프로필 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="px-5 h-[calc(100vh-100px)] flex flex-col pb-10">
      <Hero title="프로필" subtitle="프로필을 관리할 수 있습니다." />

      <div className="flex-1 space-y-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* 프로필 사진 */}
            <ProfileImageUploader
              profileId={currentUserId || ''}
              currentImageUrl={avatar || ''}
              onImageUploaded={handleAvatarUpload}
            />

            <Separator />

            {/* 위치명 */}
            <div className="space-y-2">
              <Label htmlFor="locationName">이름</Label>
              <Input
                id="locationName"
                placeholder="이름을 입력해주세요"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            <Separator />

            {/* 역할 정보 (읽기 전용) */}
            <div className="space-y-2">
              <Label>역할</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm">
                  {profile?.role === 'admin'
                    ? '관리자'
                    : profile?.role === 'manager'
                    ? '매니저'
                    : '사용자'}
                </span>
              </div>
            </div>

            <Separator />

            {/* 저장 버튼 */}
            <Button
              onClick={handleSaveProfile}
              className="w-full"
              disabled={!locationName.trim()}
            >
              프로필 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
