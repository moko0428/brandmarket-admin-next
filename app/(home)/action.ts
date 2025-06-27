'use server';

import { serverClient } from '@/lib/supabase/server';

export async function getStores() {
  const supabase = await serverClient();
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('매장 데이터 조회 에러:', error);
    return [];
  }
  return data || [];
}

export async function getStoreById(storeId: string) {
  const supabase = await serverClient();
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (error) {
    console.error('매장 상세 데이터 조회 에러:', error);
    return null;
  }
  return data;
}
