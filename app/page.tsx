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
            .select('role')
            .eq('profile_id', user.id)
            .single();

          if (profile) {
            setUserRole(profile.role as 'admin' | 'manager' | 'user');
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

  return (
    <div className="px-10 py-6">
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
