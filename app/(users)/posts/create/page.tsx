'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/common/components/hero';
import { CreatePostForm } from '../components/create-post-form';
import { browserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'user'>(
    'user'
  );
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const supabase = browserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_banned')
          .eq('profile_id', user.id)
          .single();

        if (profile) {
          setUserRole(profile.role as 'admin' | 'manager' | 'user');
          setIsBanned(profile.is_banned || false);

          if (profile.is_banned) {
            router.push('/profile');
            return;
          }
        }
      } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [router]);

  // Ban된 사용자는 게시물 작성 페이지 접근 차단
  if (isBanned) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            접근이 제한되었습니다
          </h2>
          <p className="text-gray-600">
            관리자에 의해 계정이 비활성화되어 게시물을 작성할 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-10 pb-20">
      <div className="max-w-4xl mx-auto">
        <Hero title="게시물 작성" subtitle="새로운 게시물을 작성해보세요" />

        <div className="mt-6">
          <CreatePostForm
            userRole={userRole}
            onSuccess={() => router.push('/posts')}
          />
        </div>
      </div>
    </div>
  );
}
