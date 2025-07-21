'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Heart, Eye, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { PostWithAuthor } from '@/app/(users)/posts/types';
import {
  getUserPosts,
  togglePostLike,
  deletePost,
} from '@/app/(users)/posts/action';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs';

interface MyPostListProps {
  userId: string;
  userRole: string;
  displayMode?: 'grid' | 'list';
}

export function MyPostList({
  userId,
  userRole,
  displayMode = 'grid',
}: MyPostListProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('all');

  // 권한 확인
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const canCreateProduct = isAdmin || isManager;

  // 게시물 로드
  const loadPosts = useCallback(
    async (
      pageNum = 1,
      reset = false,
      postType?: 'user_photo' | 'admin_product'
    ) => {
      try {
        setLoading(true);
        const result = await getUserPosts(userId, pageNum, 12, postType);

        if (result.success) {
          const newPosts = result.data as PostWithAuthor[];
          setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
          setHasMore(newPosts.length === 12);
        } else {
          toast.error(result.error || '게시물 로드 실패');
        }
      } catch (error) {
        console.error('게시물 로드 에러:', error);
        toast.error('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // 탭 변경 시 게시물 로드
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);

    let postType: 'user_photo' | 'admin_product' | undefined;
    if (value === 'photos') postType = 'user_photo';
    if (value === 'products') postType = 'admin_product';

    loadPosts(1, true, postType);
  };

  useEffect(() => {
    if (userId) {
      loadPosts(1, true);
    }
  }, [loadPosts, userId]);

  // 더 보기
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    let postType: 'user_photo' | 'admin_product' | undefined;
    if (activeTab === 'photos') postType = 'user_photo';
    if (activeTab === 'products') postType = 'admin_product';

    loadPosts(nextPage, false, postType);
  };

  // 게시물 수정/삭제 권한 확인
  const canEditPost = (post: PostWithAuthor) => {
    // 자신의 게시물이거나 admin인 경우
    return post.author_id === userId || isAdmin;
  };

  // 좋아요 토글
  const handleLike = async (postId: string) => {
    if (likingPosts.has(postId)) return;

    setLikingPosts((prev) => new Set([...prev, postId]));

    try {
      const result = await togglePostLike(postId);

      if (result.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.post_id === postId
              ? {
                  ...post,
                  like_count: result.liked
                    ? post.like_count + 1
                    : post.like_count - 1,
                }
              : post
          )
        );
      } else {
        toast.error(result.error || '좋아요 처리 실패');
      }
    } catch (error) {
      console.error('좋아요 에러:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // 게시물 삭제
  const handleDelete = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const result = await deletePost(postId);

      if (result.success) {
        setPosts((prev) => prev.filter((post) => post.post_id !== postId));
        toast.success('게시물이 삭제되었습니다.');
      } else {
        toast.error(result.error || '게시물 삭제 실패');
      }
    } catch (error) {
      console.error('게시물 삭제 에러:', error);
      toast.error('게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderTabsFilter = () => {
    // admin/manager만 탭 필터 표시
    if (!canCreateProduct) return null;

    return (
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="photos">사진</TabsTrigger>
          <TabsTrigger value="products">상품</TabsTrigger>
        </TabsList>
      </Tabs>
    );
  };

  if (displayMode === 'grid') {
    return (
      <div className="space-y-4">
        {/* 헤더 제거 - PostSection에서 처리 */}
        {renderTabsFilter()}

        <div className="grid grid-cols-3 gap-2">
          {posts.map((post) => (
            <div key={post.post_id} className="relative group aspect-square">
              <Link href={`/posts/${post.post_id}`}>
                {post.images.length > 0 ? (
                  <Image
                    src={post.images[0]}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">이미지 없음</span>
                  </div>
                )}
              </Link>

              {/* 호버 시 정보 표시 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    {/* 클릭 가능한 좋아요 버튼으로 변경 */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Link 클릭 방지
                        e.stopPropagation();
                        handleLike(post.post_id);
                      }}
                      disabled={likingPosts.has(post.post_id)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.like_count > 0 ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>{post.like_count}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 게시물 타입 배지 */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={
                    post.post_type === 'admin_product' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {post.post_type === 'admin_product' ? '상품' : '사진'}
                </Badge>
              </div>

              {/* 더보기 메뉴 - 권한 있는 경우만 표시 */}
              {canEditPost(post) && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/posts/${post.post_id}/edit`}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.post_id)}
                        className="text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 더 보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              variant="outline"
            >
              {loading ? '로딩 중...' : '더 보기'}
            </Button>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            <p>아직 게시물이 없습니다.</p>
          </div>
        )}
      </div>
    );
  }

  // List 모드 (기존과 동일하지만 권한 체크 추가)
  return (
    <div className="space-y-6">
      {/* 헤더 제거 - PostSection에서 처리 */}
      {renderTabsFilter()}

      {posts.map((post) => (
        <div key={post.post_id} className="border rounded-lg p-4">
          <div className="flex items-start gap-4">
            {/* 이미지 */}
            {post.images.length > 0 && (
              <div className="flex-shrink-0">
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            {/* 내용 */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/posts/${post.post_id}`}>
                    <h3 className="font-medium hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {post.content}
                  </p>
                  {/* 좋아요 버튼으로 변경 */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <button
                      onClick={() => handleLike(post.post_id)}
                      disabled={likingPosts.has(post.post_id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.like_count > 0 ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>{post.like_count}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count}</span>
                    </div>

                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* 권한 있는 경우만 메뉴 표시 */}
                {canEditPost(post) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/posts/${post.post_id}/edit`}>수정</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.post_id)}
                        className="text-red-600"
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 더 보기 버튼 */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? '로딩 중...' : '더 보기'}
          </Button>
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          <p>아직 게시물이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
