'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Separator } from '@/common/components/ui/separator';
import { Grid3X3, List, Plus } from 'lucide-react';
import { MyPostList } from '../my-post-list';
import { browserClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function PostSection() {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('user');
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
            setUserRole(profile.role);
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
          <div className="flex items-center gap-2">
            {/* 게시물 작성 버튼 */}
            <Button asChild size="sm">
              <Link href="/posts/create">
                <Plus className="w-4 h-4 mr-2" />
                작성
              </Link>
            </Button>

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
