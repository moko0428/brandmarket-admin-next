'use server';

import { serverClient } from '@/lib/supabase/server';
import {
  CreateUserPostData,
  CreateAdminPostData,
  UpdatePostData,
} from './types';
import { revalidatePath } from 'next/cache';

// 현재 사용자 확인
async function getCurrentUser() {
  const supabase = await serverClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('인증되지 않은 사용자입니다.');
  }

  return user;
}

// 사용자 권한 확인
async function getUserProfile(userId: string) {
  const supabase = await serverClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('profile_id', userId)
    .single();

  if (error) {
    throw new Error(`프로필 조회 실패: ${error.message}`);
  }

  return profile;
}

// Ban 체크 함수
async function checkUserBanStatus(userId: string) {
  const supabase = await serverClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('profile_id', userId)
    .single();

  if (error) {
    throw new Error('사용자 정보를 확인할 수 없습니다.');
  }

  if (profile?.is_banned) {
    throw new Error(
      '관리자에 의해 계정이 비활성화되어 게시물을 작성할 수 없습니다.'
    );
  }
}

// 일반 사용자 게시물 생성
export async function createUserPost(data: CreateUserPostData) {
  try {
    const user = await getCurrentUser();
    await checkUserBanStatus(user.id); // Ban 상태 체크 추가
    const supabase = await serverClient();

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        post_type: 'user_photo',
        title: data.title,
        content: data.content,
        images: data.images,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`게시물 생성 실패: ${error.message}`);
    }

    revalidatePath('/posts');
    return { success: true, data: post };
  } catch (error) {
    console.error('createUserPost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 생성 실패',
    };
  }
}

// 어드민 게시물 생성
export async function createAdminPost(data: CreateAdminPostData) {
  try {
    const user = await getCurrentUser();
    await checkUserBanStatus(user.id); // Ban 상태 체크 추가
    const profile = await getUserProfile(user.id);

    if (profile.role !== 'admin') {
      throw new Error('관리자만 상품 게시물을 작성할 수 있습니다.');
    }

    const supabase = await serverClient();

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        post_type: 'admin_product',
        title: data.title,
        content: data.content,
        images: data.images,
        product_name: data.product_name,
        price: data.price,
        size: data.size,
        color: data.color,
        available_stores: data.available_stores,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`게시물 생성 실패: ${error.message}`);
    }

    revalidatePath('/posts');
    return { success: true, data: post };
  } catch (error) {
    console.error('createAdminPost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 생성 실패',
    };
  }
}

// 게시물 조회 (페이지네이션 포함)
export async function getPosts(
  page = 1,
  limit = 10,
  type?: 'user_photo' | 'admin_product'
) {
  try {
    const supabase = await serverClient();
    const offset = (page - 1) * limit;

    // 외래키 관계명 대신 직접 조인 방식 사용
    let query = supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles!posts_author_id_profiles_profile_id_fk (
          profile_id,
          location_name,
          avatar,
          role,
          is_banned
        )
      `
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('post_type', type);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Supabase 에러 상세:', error);
      throw new Error(`게시물 조회 실패: ${error.message}`);
    }

    // 벤된 사용자의 게시물 필터링
    const filteredPosts = (posts || []).filter(
      (post) => !post.author?.is_banned
    );

    // 어드민 게시물의 경우 매장 정보도 가져오기
    const postsWithStores = await Promise.all(
      filteredPosts.map(async (post) => {
        if (
          post.post_type === 'admin_product' &&
          post.available_stores?.length > 0
        ) {
          const { data: stores } = await supabase
            .from('stores')
            .select('store_id, branch, address')
            .in('store_id', post.available_stores);

          return { ...post, stores: stores || [] };
        }
        return post;
      })
    );

    return { success: true, data: postsWithStores };
  } catch (error) {
    console.error('getPosts 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 조회 실패',
    };
  }
}

// 특정 게시물 조회
export async function getPost(postId: string) {
  try {
    const supabase = await serverClient();

    // 조회수 증가는 별도로 처리
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        view_count: supabase.rpc('increment_view_count', { post_id: postId }),
      })
      .eq('post_id', postId);

    if (updateError) {
      console.warn('조회수 업데이트 실패:', updateError);
    }

    const { data: post, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles (
          profile_id,
          location_name,
          avatar,
          role
        )
      `
      )
      .eq('post_id', postId)
      .single();

    if (error) {
      throw new Error(`게시물 조회 실패: ${error.message}`);
    }

    // 어드민 게시물의 경우 매장 정보도 가져오기
    if (
      post.post_type === 'admin_product' &&
      post.available_stores?.length > 0
    ) {
      const { data: stores } = await supabase
        .from('stores')
        .select('store_id, branch, address')
        .in('store_id', post.available_stores);

      return { success: true, data: { ...post, stores: stores || [] } };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error('getPost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 조회 실패',
    };
  }
}

// 게시물 수정
export async function updatePost(postId: string, data: UpdatePostData) {
  try {
    const user = await getCurrentUser();
    const supabase = await serverClient();

    // 게시물 소유자 또는 관리자인지 확인
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('post_id', postId)
      .single();

    if (!post) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const profile = await getUserProfile(user.id);
    const isOwner = post.author_id === user.id;
    const isAdmin = profile.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new Error('게시물을 수정할 권한이 없습니다.');
    }

    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedPost, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('post_id', postId)
      .select()
      .single();

    if (error) {
      throw new Error(`게시물 수정 실패: ${error.message}`);
    }

    revalidatePath('/posts');
    revalidatePath(`/posts/${postId}`);
    return { success: true, data: updatedPost };
  } catch (error) {
    console.error('updatePost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 수정 실패',
    };
  }
}

// 게시물 삭제
export async function deletePost(postId: string) {
  try {
    const user = await getCurrentUser();
    const supabase = await serverClient();

    // 게시물 소유자 또는 관리자인지 확인
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('post_id', postId)
      .single();

    if (!post) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const profile = await getUserProfile(user.id);
    const isOwner = post.author_id === user.id;
    const isAdmin = profile.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new Error('게시물을 삭제할 권한이 없습니다.');
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('post_id', postId);

    if (error) {
      throw new Error(`게시물 삭제 실패: ${error.message}`);
    }

    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    console.error('deletePost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 삭제 실패',
    };
  }
}

// 게시물 좋아요 토글
export async function togglePostLike(postId: string) {
  try {
    const user = await getCurrentUser();
    const supabase = await serverClient();

    // 기존 좋아요 확인
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // 좋아요 취소
      await supabase.from('post_likes').delete().eq('id', existingLike.id);

      // 좋아요 수 감소
      await supabase
        .from('posts')
        .update({
          like_count: supabase.rpc('decrement_like_count', { post_id: postId }),
        })
        .eq('post_id', postId);

      return { success: true, liked: false };
    } else {
      // 좋아요 추가
      await supabase.from('post_likes').insert({
        post_id: postId,
        user_id: user.id,
      });

      // 좋아요 수 증가
      await supabase
        .from('posts')
        .update({
          like_count: supabase.rpc('increment_like_count', { post_id: postId }),
        })
        .eq('post_id', postId);

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('togglePostLike 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '좋아요 처리 실패',
    };
  }
}

// 매장 목록 조회 (어드민 게시물 작성용)
export async function getStoresForPost() {
  try {
    const supabase = await serverClient();

    const { data: stores, error } = await supabase
      .from('stores')
      .select('store_id, branch, address')
      .order('branch');

    if (error) {
      throw new Error(`매장 조회 실패: ${error.message}`);
    }

    return { success: true, data: stores || [] };
  } catch (error) {
    console.error('getStoresForPost 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '매장 조회 실패',
    };
  }
}

// 특정 사용자의 게시물 조회 함수 추가
export async function getUserPosts(
  userId: string,
  page = 1,
  limit = 10,
  type?: 'user_photo' | 'admin_product'
) {
  try {
    const supabase = await serverClient();
    const currentUser = await getCurrentUser(); // 현재 로그인한 사용자
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles (
          profile_id,
          location_name,
          avatar,
          role
        ),
        post_likes!left(user_id)
      `
      )
      .eq('author_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('post_type', type);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw new Error(`게시물 조회 실패: ${error.message}`);
    }

    // 좋아요 상태 추가
    const postsWithLikeStatus = (posts || []).map((post) => ({
      ...post,
      isLiked:
        post.post_likes?.some(
          (like: { user_id: string }) => like.user_id === currentUser.id
        ) || false,
    }));

    return { success: true, data: postsWithLikeStatus };
  } catch (error) {
    console.error('getUserPosts 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '게시물 조회 실패',
    };
  }
}

// 특정 매장의 상품 게시물 조회 (정책 불필요)
export async function getStoreProducts(storeId: string) {
  try {
    const supabase = await serverClient();

    // 모든 상품 게시물을 가져온 후 클라이언트에서 필터링
    const { data: posts, error } = await supabase
      .from('posts')
      .select(
        `
        post_id,
        title,
        images,
        product_name,
        price,
        size,
        color,
        available_stores,
        created_at,
        author:profiles (
          profile_id,
          location_name,
          avatar,
          role
        )
      `
      )
      .eq('post_type', 'admin_product')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`매장 상품 조회 실패: ${error.message}`);
    }

    // 클라이언트 사이드에서 해당 매장 상품만 필터링
    const filteredPosts = (posts || [])
      .filter((post) => {
        if (!post.available_stores) return false;

        try {
          const stores = Array.isArray(post.available_stores)
            ? post.available_stores
            : JSON.parse(post.available_stores as string);

          return stores.includes(storeId);
        } catch (e) {
          console.error('available_stores 파싱 에러:', e);
          return false;
        }
      })
      .slice(0, 10);

    return { success: true, data: filteredPosts };
  } catch (error) {
    console.error('getStoreProducts 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '매장 상품 조회 실패',
    };
  }
}
