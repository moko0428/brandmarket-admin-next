'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Heart, Eye, MoreHorizontal } from 'lucide-react';
import { AdminPost, PostWithAuthor } from '../types';
import { getPosts, togglePostLike, deletePost } from '../action';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/common/components/ui/carousel';

interface Store {
  store_id: string;
  branch: string;
  address: string;
}

interface PostListProps {
  userRole?: 'admin' | 'manager' | 'user';
  userId?: string;
  postType?: 'user_photo' | 'admin_product';
}

export function PostList({ userRole, userId, postType }: PostListProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  // 게시물 로드
  const loadPosts = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        setLoading(true);
        const result = await getPosts(pageNum, 10, postType);

        if (result.success) {
          const newPosts = result.data as PostWithAuthor[];
          setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
          setHasMore(newPosts.length === 10);
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
    [postType]
  );

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  // 더 보기
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, false);
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

  // 수정/삭제 권한 확인
  const canEditPost = (post: PostWithAuthor) => {
    return post.author_id === userId || userRole === 'admin';
  };

  // 이미지 렌더링 컴포넌트
  const renderPostImages = (post: PostWithAuthor) => {
    if (post.images.length === 0) return null;

    if (post.images.length === 1) {
      // 단일 이미지
      return (
        <div className="relative">
          <Image
            src={post.images[0]}
            alt={`${post.title} 이미지`}
            width={600}
            height={400}
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      );
    }

    // 다중 이미지 - 캐러셀 사용
    return (
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {post.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <Image
                    src={image}
                    alt={`${post.title} 이미지 ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 이미지 개수 표시 */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            +{post.images.length}
          </div>
        </Carousel>
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.post_id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* 작성자 정보 */}
            <div className="p-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {post.author?.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.location_name}
                      width={40}
                      height={40}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {post.author?.location_name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {post.author?.location_name}
                    </span>
                    <Badge
                      variant={
                        post.post_type === 'admin_product'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {post.post_type === 'admin_product' ? '상품' : '사진'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* 더보기 메뉴 */}
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

            {/* 이미지 - 캐러셀로 교체 */}
            {renderPostImages(post)}

            {/* 내용 */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>

              {post.content && (
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {post.content}
                </p>
              )}

              {/* 상품 정보 (어드민 게시물) */}
              {post.post_type === 'admin_product' && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {(post as AdminPost).product_name}
                    </span>
                    <span className="font-bold text-lg">
                      {(post as AdminPost).price?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>사이즈: {(post as AdminPost).size}</span>
                    <span>컬러: {(post as AdminPost).color}</span>
                  </div>
                  {(post as AdminPost).stores &&
                    post.stores &&
                    post.stores.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">판매 매장: </span>
                        <span className="font-medium">
                          {(post as AdminPost).stores
                            ?.map((store: Store) => store.branch)
                            .join(', ') || '매장 정보 없음'}
                        </span>
                      </div>
                    )}
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.post_id)}
                    disabled={likingPosts.has(post.post_id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.like_count}</span>
                  </button>

                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span>{post.view_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <p className="text-sm mt-1">첫 번째 게시물을 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}
