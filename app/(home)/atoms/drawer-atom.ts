import { atom } from 'jotai';
import { stores } from '@/data/store'; // 초기 매장 목록
import type { Store } from '../page'; // Store 타입 재사용

/* Drawer 열림 여부 */
export const drawerOpenAtom = atom<boolean>(false);

/* 모바일 키워드(지역) 선택 */
export const selectedKeywordAtom = atom<string | null>(null);

/* 매장 리스트(필터 결과) */
export const filteredStoresAtom = atom<Store[]>(stores); // 초기값 = 전체 매장

/* 정렬 방법: 거리·영업상태·기본 */
export const sortTypeAtom = atom<'distance' | 'status' | 'none'>('none');

/* 지도/리스트에서 선택된 매장(상세 시트용) */
export const selectedStoreAtom = atom<Store | null>(null);
