'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Separator } from '@/common/components/ui/separator';
import { Grid3X3, List, Plus, Package, Camera } from 'lucide-react';
import { MyPostList } from '../my-post-list';
import { browserClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function PostSection() {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('user');
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const supabase = browserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);

          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_banned')
            .eq('profile_id', user.id)
            .single();

          if (profile) {
            setUserRole(profile.role);
            setIsBanned(profile.is_banned || false);
          }
        }
      } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // 권한 확인
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const canCreateProduct = isAdmin || isManager;

  // 작성 버튼 렌더링
  const renderCreateButtons = () => {
    if (isBanned) {
      return (
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <span className="text-sm text-red-600">
              게시물 작성이 제한되었습니다
            </span>
          </div>
        </div>
      );
    }

    if (canCreateProduct) {
      // admin/manager: 두 개의 버튼
      return (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/posts/create?type=photo">
              <Camera className="w-4 h-4 mr-2" />
              사진 게시물
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/posts/create?type=product">
              <Package className="w-4 h-4 mr-2" />
              상품 게시물
            </Link>
          </Button>
        </div>
      );
    } else {
      // 일반 user: 하나의 버튼
      return (
        <Button asChild size="sm">
          <Link href="/posts/create">
            <Plus className="w-4 h-4 mr-2" />
            게시물 작성
          </Link>
        </Button>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0">
          <h2>내 포스트</h2>
          <Separator />
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">내 포스트</h2>
          <div className="flex items-center gap-3">
            {/* 게시물 작성 버튼들 */}
            {renderCreateButtons()}

            {/* 표시 모드 토글 버튼 */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={displayMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={displayMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {userId && (
          <MyPostList
            userId={userId}
            userRole={userRole}
            displayMode={displayMode}
          />
        )}
      </div>
    </div>
  );
}
