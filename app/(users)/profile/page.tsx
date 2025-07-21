'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hero } from '@/common/components/hero';
import Height from '@/common/components/height';
import { toast } from 'sonner';
import { browserClient } from '@/lib/supabase/client';
import { Tables } from '@/database.types';
import { getProfile } from './action';
import ProfileSection from './components/section/profile-section';
import ManageSectionContainer from './components/section/manage-section-container';
import StoreManageSection from './components/section/store-manage-section';
// import InventorySection from './components/section/inventory-section';
// import MemberSection from './components/section/member-section';
import PostManageSection from './components/section/post-manage-section';
import PostSection from './components/section/post-section';
import EditProfileSheet from './components/sheet/edit-profile-sheet';
import StoreManagementSheet from './components/sheet/store-management-sheet';
// import MemberManageSheet from './components/sheet/member-manage-sheet';
import { User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [open, setOpen] = useState({
    profile: false,
    store: false,
    inventory: false,
    post: false,
    member: false,
  });

  // 현재 사용자 ID 가져오기
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
  const loadProfile = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const profileData = await getProfile(currentUserId);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('프로필 데이터 로드 에러:', error);
      toast.error('프로필 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdate = useCallback(async () => {
    try {
      // 프로필 데이터 다시 로드
      if (currentUserId) {
        const updatedProfile = await getProfile(currentUserId);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }
    } catch (error) {
      console.error('프로필 업데이트 후 새로고침 에러:', error);
    }
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span className="text-2xl font-bold">프로필 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="px-10 flex flex-col">
      {/* 헤더 영역 - 고정 높이 */}
      <div className="">
        <Hero title="마이페이지" subtitle="프로필을 관리할 수 있습니다." />
        <ProfileSection
          avatar={profile?.avatar || ''}
          name={profile?.location_name || ''}
          role={profile?.role || ''}
          setOpen={() => setOpen({ ...open, profile: true })}
        />
        <Height height={20} />
      </div>
      {['admin', 'manager'].includes(profile?.role || '') && (
        <ManageSectionContainer>
          <StoreManageSection
            setOpen={() => setOpen({ ...open, store: true })}
          />
          {/* <InventorySection /> */}
          {/* <MemberSection setOpen={() => setOpen({ ...open, member: true })} /> */}
          <PostManageSection />
        </ManageSectionContainer>
      )}
      <Height height={20} />

      <PostSection />

      {/* Sheet들 */}
      <EditProfileSheet
        open={open.profile}
        onOpenChange={(isOpen) => {
          setOpen({ ...open, profile: isOpen });
          if (!isOpen) {
            handleProfileUpdate();
          }
        }}
        profile={profile as Profile}
        user={{ id: (currentUserId as string) || '' } as User}
        onProfileUpdate={handleProfileUpdate}
      />
      <StoreManagementSheet
        open={open.store}
        onOpenChange={() => setOpen({ ...open, store: false })}
      />
      {/* <MemberManageSheet
        open={open.member}
        onOpenChange={() => setOpen({ ...open, member: false })}
      /> */}
    </div>
  );
}
