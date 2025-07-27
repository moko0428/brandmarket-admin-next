'use server';

import { Tables } from '@/database.types';
import { serverClient } from '@/lib/supabase/server';

// 타입 정의
interface ManagerStoreAssignment {
  store_id: string;
  stores: {
    store_id: string;
    branch: string;
    address: string;
    open_time: string;
    close_time: string;
    latitude: string;
    longitude: string;
    location: string;
    description: string;
    store_image: string;
    profile_id: string;
    created_at: string;
    updated_at: string;
    directions: string[];
  };
}

// 현재 인증된 사용자 확인 헬퍼 함수
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

// 관리자 권한 확인 헬퍼 함수
async function checkAdminPermission() {
  const supabase = await serverClient();
  const user = await getCurrentUser();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('profile_id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    throw new Error('관리자 권한이 필요합니다.');
  }

  return true;
}

// // 매니저 권한도 체크하는 함수 추가
// async function checkManagerOrAdminPermission(profileId?: string) {
//   const supabase = await serverClient();
//   const user = await getCurrentUser();

//   const { data: profile, error } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('profile_id', user.id)
//     .single();

//   if (error) {
//     throw new Error('사용자 정보를 가져올 수 없습니다.');
//   }

//   // 관리자이거나, 매니저이면서 자신의 정보를 조회하는 경우
//   if (
//     profile?.role === 'admin' ||
//     (profile?.role === 'manager' && (!profileId || profileId === user.id))
//   ) {
//     return true;
//   }

//   throw new Error('권한이 없습니다.');
// }

export async function updateProfile(
  profileId: string,
  updates: Partial<{
    location_name: string;
    avatar: string;
  }>
) {
  try {
    const supabase = await serverClient();
    const currentUser = await getCurrentUser();

    // 자신의 프로필이거나 관리자인 경우만 허용
    if (currentUser.id !== profileId) {
      await checkAdminPermission();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) {
      console.error('프로필 업데이트 에러:', error);
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '프로필 업데이트 실패';
    console.error('updateProfile 에러:', error);
    return { error: errorMessage, data: null };
  }
}

export async function getProfile(profileId: string) {
  try {
    const supabase = await serverClient();
    const currentUser = await getCurrentUser();

    // 자신의 프로필이거나 관리자인 경우만 허용
    if (currentUser.id !== profileId) {
      await checkAdminPermission();
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      console.error('프로필 조회 에러:', error);
    }

    return data;
  } catch (error) {
    console.error('getProfile 에러:', error);
    return null;
  }
}

export async function getMyProfile(profileId: string) {
  const supabase = await serverClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`profile_id,avatar, location_name, role`)
    .eq('profile_id', profileId)
    .single();

  if (error) {
    console.log('프로필 조회 에러:', error);
    return null;
  }
  return { data: data as Tables<'profiles'>, error: null };
}
export async function updateProfileAction(
  prevState: { error: string; success?: boolean },
  formData: FormData
) {
  try {
    const locationName = formData.get('location_name') as string;

    if (!locationName?.trim()) {
      return { error: '이름을 입력해주세요.' };
    }

    const supabase = await serverClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: '사용자 정보를 가져올 수 없습니다.' };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        location_name: locationName.trim(),
      })
      .eq('profile_id', user.id);

    if (profileError) {
      console.error('프로필 업데이트 에러:', profileError);

      // 프로필 업데이트 에러 한글화
      if (profileError.code === 'PGRST116') {
        return { error: '프로필을 찾을 수 없습니다.' };
      }

      if (profileError.code === '42703') {
        return { error: '프로필 업데이트 중 오류가 발생했습니다.' };
      }

      return { error: '프로필 업데이트 중 오류가 발생했습니다.' };
    }

    return { error: '', success: true };
  } catch (error) {
    console.error('프로필 업데이트 처리 중 오류:', error);
    return { error: '프로필 업데이트 처리 중 오류가 발생했습니다.' };
  }
}

export async function deleteAccountAction() {
  try {
    const supabase = await serverClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: '사용자 정보를 가져올 수 없습니다.' };
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      console.error('계정 삭제 에러:', deleteError);
      return { error: '계정 삭제 중 오류가 발생했습니다.' };
    }

    return { error: '', success: true };
  } catch (error) {
    console.error('계정 삭제 처리 중 오류:', error);
    return { error: '계정 삭제 처리 중 오류가 발생했습니다.' };
  }
}

export async function getMembers() {
  const supabase = await serverClient();

  const { data } = await supabase.from('profiles').select('*');

  return data;
}

// 모든 회원 조회 (관리자 전용)
export async function getAllMembers({ profileId }: { profileId: string }) {
  try {
    const supabase = await serverClient();
    await checkAdminPermission(); // 관리자 권한 확인

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('profile_id', profileId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('회원 목록 조회 에러:', error);
      throw new Error(`회원 목록 조회 실패: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('getAllMembers 에러:', error);
    return null;
  }
}

// 회원 벤 처리 (관리자 전용)
export async function banMember(profileId: string, isBanned: boolean) {
  try {
    const supabase = await serverClient();
    await checkAdminPermission(); // 관리자 권한 확인

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: isBanned })
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) {
      console.error('벤 처리 에러:', error);
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '벤 처리 실패';
    console.error('banMember 에러:', error);
    return { error: errorMessage, data: null };
  }
}

// 매니저-매장 연결 - 올바른 테이블명 사용
export async function assignManagerToStore(profileId: string, storeId: string) {
  try {
    const supabase = await serverClient();
    await checkAdminPermission();

    // 이미 할당되어 있는지 확인
    const { data: existing } = await supabase
      .from('branch_manager')
      .select('id')
      .eq('profile_id', profileId)
      .eq('store_id', storeId)
      .single();

    if (existing) {
      return { error: '이미 할당된 매장입니다.', data: null };
    }

    const { data, error } = await supabase
      .from('branch_manager')
      .insert({
        profile_id: profileId,
        store_id: storeId,
      })
      .select()
      .single();

    if (error) {
      console.error('매니저-매장 연결 에러:', error);
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '매장 할당 실패';
    console.error('assignManagerToStore 에러:', error);
    return { error: errorMessage, data: null };
  }
}

// 매니저-매장 연결 해제 - 올바른 테이블명 사용
export async function unassignManagerFromStore(
  profileId: string,
  storeId: string
) {
  try {
    const supabase = await serverClient();
    await checkAdminPermission(); // 관리자 권한 확인

    const { error } = await supabase
      .from('branch_manager') // 올바른 테이블명
      .delete()
      .eq('profile_id', profileId) // profile_id 컬럼 사용
      .eq('store_id', storeId);

    if (error) {
      console.error('매니저-매장 연결 해제 에러:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '매장 할당 해제 실패';
    console.error('unassignManagerFromStore 에러:', error);
    return { error: errorMessage };
  }
}

// 매장 목록 조회 - 수정된 버전
export async function getStores() {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('branch'); // 'name' 대신 'branch' 사용

    if (error) {
      console.error('매장 목록 조회 에러:', error);
      return [];
    }

    console.log('매장 데이터 조회 결과:', data); // 디버깅용
    return data || [];
  } catch (error) {
    console.error('getStores 에러:', error);
    return [];
  }
}

// 매니저의 할당된 매장 조회 - 개선된 버전
export async function getManagerStores(
  profileId: string
): Promise<ManagerStoreAssignment[]> {
  try {
    const supabase = await serverClient();

    // 먼저 사용자가 매니저인지 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('profile_id', profileId)
      .single();

    if (profile?.role !== 'manager') {
      console.log('매니저가 아닌 사용자의 매장 조회 시도:', profileId);
      return [];
    }

    const { data, error } = await supabase
      .from('branch_manager')
      .select(
        `
        store_id,
        stores (*)
      `
      )
      .eq('profile_id', profileId);

    if (error) {
      console.error('매니저 매장 조회 에러:', error);
      return [];
    }

    console.log('매니저 매장 조회 결과:', data);
    return data as unknown as ManagerStoreAssignment[];
  } catch (error) {
    console.error('getManagerStores 에러:', error);
    return [];
  }
}

// 역할 업데이트 (관리자 전용)
export async function updateMemberRole(profileId: string, role: string) {
  try {
    const supabase = await serverClient();
    await checkAdminPermission(); // 관리자 권한 확인

    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      throw new Error('유효하지 않은 역할입니다.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) {
      console.error('역할 업데이트 에러:', error);
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '역할 업데이트 실패';
    console.error('updateMemberRole 에러:', error);
    return { error: errorMessage, data: null };
  }
}

export async function updateProfileAvatar(
  profileId: string,
  avatarUrl: string
) {
  try {
    const supabase = await serverClient();
    const currentUser = await getCurrentUser();

    // 자신의 프로필만 업데이트 가능 (기본 권한)
    if (currentUser.id !== profileId) {
      throw new Error('자신의 프로필만 수정할 수 있습니다.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar: avatarUrl,
        updatedAt: new Date().toISOString(),
      })
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) {
      console.error('프로필 아바타 업데이트 에러:', error);
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '아바타 업데이트 실패';
    console.error('updateProfileAvatar 에러:', error);
    return { error: errorMessage, data: null };
  }
}
