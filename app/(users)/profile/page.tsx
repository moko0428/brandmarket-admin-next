'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hero } from '@/common/components/hero';
import Height from '@/common/components/height';
import { toast } from 'sonner';
import { browserClient } from '@/lib/supabase/client';
import { Tables } from '@/database.types';
import { getProfile } from './action';
import ProfileSection from './components/section/profile-section';
import StoreManageSection from './components/section/store-manage-section';
// import InventorySection from './components/section/inventory-section';
// import MemberSection from './components/section/member-section';
import EditProfileSheet from './components/sheet/edit-profile-sheet';
import StoreManagementSheet from './components/sheet/store-management-sheet';
// import MemberManageSheet from './components/sheet/member-manage-sheet';
import { User } from '@supabase/supabase-js';
import PostSection from './components/section/post-section';
import MemberManageSheet from './components/sheet/member-manage-sheet';
import MemberSection from './components/section/member-section';

export type Profile = Tables<'profiles'>;

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

  if (profile?.is_banned) {
    return (
      <div className="px-10 flex flex-col pb-20">
        <div className="">
          <Hero title="마이페이지" subtitle="프로필을 관리할 수 있습니다." />
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  계정이 비활성화되었습니다
                </h3>
                <p className="text-red-600 mt-1">
                  관리자에 의해 계정이 비활성화되어 일부 기능이 제한됩니다.
                </p>
              </div>
            </div>
          </div>
          <ProfileSection
            avatar={profile?.avatar || ''}
            name={profile?.location_name || ''}
            role={profile?.role || ''}
            setOpen={() => setOpen({ ...open, profile: true })}
          />
        </div>

        {/* 제한된 기능만 표시 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">
            계정 비활성화로 인해 게시물 작성 및 일부 기능이 제한됩니다.
          </p>
        </div>

        {/* 프로필 수정만 허용 */}
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
      </div>
    );
  }

  return (
    <div className="px-10 flex flex-col pb-20">
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
        <StoreManageSection setOpen={() => setOpen({ ...open, store: true })} />
      )}
      {/* <InventorySection /> */}
      {['admin'].includes(profile?.role || '') && (
        <MemberSection setOpen={() => setOpen({ ...open, member: true })} />
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
        user={profile as Profile}
      />
      <MemberManageSheet
        open={open.member}
        onOpenChange={() => setOpen({ ...open, member: false })}
      />
    </div>
  );
}
