'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/common/components/hero';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/common/components/ui/tabs';
import { PostList } from './(users)/posts/components/post-list';
import { browserClient } from '@/lib/supabase/client';

export default function PostsPage() {
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'user'>(
    'user'
  );
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

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
            setUserRole(profile.role as 'admin' | 'manager' | 'user');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 벤된 사용자에게는 접근 불가 메시지만 표시 (토스트 없음)
  if (isBanned) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            접근 불가
          </h2>
          <p className="text-gray-600">
            관리자에 의해 계정이 제한되어 이용할 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10  pb-20">
      <div className="">
        <div className="flex flex-col justify-between mb-6">
          <Hero title="게시물" subtitle="사진과 상품을 공유해보세요" />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="photos">사진</TabsTrigger>
            <TabsTrigger value="products">상품</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PostList userRole={userRole} userId={userId} />
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <PostList
              userRole={userRole}
              userId={userId}
              postType="user_photo"
            />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <PostList
              userRole={userRole}
              userId={userId}
              postType="admin_product"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
