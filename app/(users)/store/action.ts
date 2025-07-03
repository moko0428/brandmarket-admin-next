'use server';

import { serverClient } from '@/lib/supabase/server';

interface State {
  error: string | null;
  data: { store_id: string } | null;
}
export async function getStores() {
  const supabase = await serverClient();

  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('매장 데이터 조회 에러:', error);
    return [];
  }

  return stores || [];
}

export async function updateStore(
  storeId: string,
  updates: Partial<{
    branch: string;
    address: string;
    open_time: string;
    close_time: string;
    latitude: string;
    longitude: string;
    location: string;
    description: string;
    store_image: string;
    directions: string[];
  }>
) {
  const supabase = await serverClient();

  const { data, error } = await supabase
    .from('stores')
    .update(updates)
    .eq('store_id', storeId)
    .select()
    .single();

  if (error) {
    console.error('매장 업데이트 에러:', error);
    return { error: error.message, data: null };
  }

  return { error: null, data };
}

export async function deleteStore(storeId: string) {
  const supabase = await serverClient();

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('store_id', storeId);

  if (error) {
    console.error('매장 삭제 에러:', error);
    return { error: error.message };
  }

  return { error: null };
}

export async function addStore(
  prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await serverClient();
  const { data, error } = await supabase.from('stores').insert({
    branch: formData.get('branch') as string,
    address: formData.get('address') as string,
    open_time: formData.get('open_time') as string,
    close_time: formData.get('close_time') as string,
    latitude: formData.get('latitude') as string,
    longitude: formData.get('longitude') as string,
    location: formData.get('location') as string,
    description: formData.get('description') as string,
    store_image: formData.get('store_image') as string,
    profile_id: formData.get('profile_id') as string,
    directions: [],
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data };
}

export async function uploadStoreImage(file: File, storeId: string) {
  const supabase = await serverClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${storeId}-${Date.now()}.${fileExt}`;
  const filePath = `store-images/${fileName}`;

  const { error } = await supabase.storage
    .from('store-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('이미지 업로드 에러:', error);
    return { error: error.message, data: null };
  }

  // 공개 URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from('store-images').getPublicUrl(filePath);

  return { error: null, data: publicUrl };
}
