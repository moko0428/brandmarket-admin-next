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
          .select('role')
          .eq('profile_id', user.id)
          .single();

        if (profile) {
          setUserRole(profile.role as 'admin' | 'manager' | 'user');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-6">
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
