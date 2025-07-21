import { atom } from 'jotai';
import { Tables } from '@/database.types';

// Supabase Store 타입 사용
export type Store = Tables<'stores'>;

/* Drawer 열림 여부 */
export const drawerOpenAtom = atom<boolean>(false);

/* 모바일 키워드(지역) 선택 */
export const selectedKeywordAtom = atom<string | null>(null);

/* 매장 리스트(필터 결과) - 초기값은 빈 배열 */
export const filteredStoresAtom = atom<Store[]>([]);

/* 정렬 방법: 거리·영업상태·기본 */
export const sortTypeAtom = atom<'distance' | 'status' | 'none'>('none');

/* 지도/리스트에서 선택된 매장(상세 시트용) */
export const selectedStoreAtom = atom<Store | null>(null);

/* 전체 매장 데이터 (Supabase에서 로드된 데이터) */
export const allStoresAtom = atom<Store[]>([]);

/* 매장 데이터 로딩 상태 */
export const storesLoadingAtom = atom<boolean>(false);
