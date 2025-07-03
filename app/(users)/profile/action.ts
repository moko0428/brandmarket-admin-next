'use server';

import { serverClient } from '@/lib/supabase/server';

export async function updateProfile(
  profileId: string,
  updates: Partial<{
    location_name: string;
    avatar: string;
  }>
) {
  const supabase = await serverClient();

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
}

export async function getProfile(profileId: string) {
  const supabase = await serverClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    console.error('프로필 조회 에러:', error);
    return null;
  }

  return data;
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
