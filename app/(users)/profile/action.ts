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
