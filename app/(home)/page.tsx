'use client';
import { MapPin, MenuIcon } from 'lucide-react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import LocationCard from './components/location-card';
import { DateTime } from 'luxon';
import { useAtom } from 'jotai';
import {
  drawerOpenAtom,
  filteredStoresAtom,
  selectedKeywordAtom,
  sortTypeAtom,
  selectedStoreAtom,
} from './atoms/drawer-atom';

import { StoreListFilter } from './components/store-list-filter';

import Image from 'next/image';
import StoreDetailSheet from './components/store-detail-sheet';
import Link from 'next/link';
import { getStores, getAdminProfile } from './action';

import { CURRENT_LOCATION_LAT, CURRENT_LOCATION_LNG } from './constants';
import Drawer from './components/drawer';

// Supabase Store 타입 정의
interface SupabaseStore {
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
}

const filterOptions = [
  { label: '거리순', value: 'distance' },
  { label: '영업상태순', value: 'status' },
  { label: '기본순', value: 'none' },
];

export default function LocationPage() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_API_KEY!,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: CURRENT_LOCATION_LAT,
    lng: CURRENT_LOCATION_LNG,
  });

  const [stores, setStores] = useState<SupabaseStore[]>([]);
  const [filteredStores, setFilteredStores] = useAtom(filteredStoresAtom);
  const [distances, setDistances] = useState<{ [key: string]: number }>({});
  const [sortType, setSortType] = useAtom(sortTypeAtom);
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
  const [selectedKeyword, setSelectedKeyword] = useAtom(selectedKeywordAtom);
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [, setAdminAvatar] = useState<string>('/brandmarket_logo.png');

  // Supabase에서 매장 데이터 로드
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await getStores();
        setStores(storesData);
        setFilteredStores(storesData);
      } catch (error) {
        console.error('매장 데이터 로드 에러:', error);
      } finally {
        setIsLoadingStores(false);
      }
    };

    loadStores();
  }, [setFilteredStores]);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(currentPos);
          setCurrentLocation(currentPos);
        },
        (error) => {
          console.error('**현재 위치를 가져오는데 실패**', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // Admin 프로필 로드
  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const adminProfile = await getAdminProfile();
        if (adminProfile?.avatar) {
          setAdminAvatar(adminProfile.avatar);
        }
      } catch (error) {
        console.error('Admin 프로필 로드 에러:', error);
      }
    };

    loadAdminProfile();
  }, []);

  // 두 지점 간의 거리 계산 함수
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 현재 위치가 업데이트될 때마다 거리 계산
  useEffect(() => {
    if (currentLocation && stores.length > 0) {
      const newDistances = stores.reduce((acc, store) => {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          parseFloat(store.latitude),
          parseFloat(store.longitude)
        );
        return {
          ...acc,
          [store.store_id]: Math.round(distance * 10) / 10,
        };
      }, {});
      setDistances(newDistances);
    }
  }, [currentLocation, stores]);

  // 거리 포맷팅 함수를 먼저 정의
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${Math.round(distance * 10) / 10}km`;
  };

  if (loading || isLoadingStores)
    return (
      <div className="flex justify-center items-center h-full">
        페이지를 불러오는 중 입니다.. 잠시만 기다려주세요..
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        삐빅 문제가 발생했습니다. {error.message}
      </div>
    );

  const handleStoreSearch = (searchValue: string) => {
    // 매장 리스트 필터링
    const filtered = stores.filter((store) => {
      const storeName = store.branch.toLowerCase();
      return storeName.includes(searchValue.toLowerCase());
    });

    setFilteredStores(filtered);

    // 추가: 해당 키워드의 첫 번째 매장으로 지도 이동
    const firstMatchingStore = filtered[0];
    if (firstMatchingStore) {
      const lat = parseFloat(firstMatchingStore.latitude);
      const lng = parseFloat(firstMatchingStore.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    }
  };

  const isOpenTime = (openTimeStr: string, closeTimeStr: string) => {
    const now = DateTime.now();
    const [startHour, startMinute] = openTimeStr.split(':').map(Number);
    const [endHour, endMinute] = closeTimeStr.split(':').map(Number);

    const currentHour = now.hour;
    const currentMinute = now.minute;
    const currentTime = currentHour * 60 + currentMinute;
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime < endTime;
  };

  // 거리 계산 함수
  const storesWithDistance = filteredStores.map((store) => {
    const distance = distances[store.store_id];

    return {
      ...store,
      distance: distance ? formatDistance(distance) : null,
    };
  });

  // 정렬 함수
  const getSortedStores = (stores: typeof storesWithDistance) => {
    switch (sortType) {
      case 'distance':
        return [...stores].sort((a, b) => {
          const distanceA = a.distance
            ? parseFloat(a.distance.replace('km', '').replace('m', ''))
            : Infinity;
          const distanceB = b.distance
            ? parseFloat(b.distance.replace('km', '').replace('m', ''))
            : Infinity;
          return distanceA - distanceB;
        });
      case 'status':
        return [...stores].sort((a, b) => {
          const isAOpen = isOpenTime(a.open_time, a.close_time);
          const isBOpen = isOpenTime(b.open_time, b.close_time);
          if (isAOpen && !isBOpen) return -1;
          if (!isAOpen && isBOpen) return 1;
          return 0;
        });
      default:
        return stores;
    }
  };

  // 키워드 버튼 컴포넌트 (동적으로 생성)
  const KeywordButtons = () => {
    const uniqueKeywords = [...new Set(stores.map((store) => store.branch))];

    return (
      <div className="flex gap-2 flex-wrap items-center">
        {uniqueKeywords.map((keyword) => (
          <Button
            key={keyword}
            variant={selectedKeyword === keyword ? 'default' : 'outline'}
            size="sm"
            type="button"
            onClick={() => {
              if (selectedKeyword === keyword) {
                // 같은 키워드를 다시 클릭하면 필터 해제
                setSelectedKeyword(null);
                setFilteredStores(stores);
                // 현재 위치로 지도 이동
                if (currentLocation) {
                  setMapCenter(currentLocation);
                }
              } else {
                setSelectedKeyword(keyword);
                handleStoreSearch(keyword);
              }
            }}
            className="transition-colors text-xs"
          >
            {keyword}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedKeyword(null);
            setFilteredStores(stores);
            if (currentLocation) {
              setMapCenter(currentLocation);
            }
            setSortType('none');
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          초기화
        </Button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      {/* 지도 컨테이너 */}
      <div className="col-span-1 md:col-span-2 relative md:h-[calc(100vh-10rem)] h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <Map center={mapCenter} className="w-full h-full" level={3}>
            {/* 현재 위치 마커 */}
            {currentLocation && (
              <>
                <CustomOverlayMap position={currentLocation}>
                  <div className="relative">
                    <div className="absolute -translate-y-4 bottom-10 left-1/2 -translate-x-2">
                      <MapPin className="w-6 h-6 text-blue-500 bg-white rounded-full" />
                    </div>
                  </div>
                </CustomOverlayMap>
              </>
            )}

            {stores.map((store) => (
              <CustomOverlayMap
                key={store.store_id}
                position={{
                  lat: parseFloat(store.latitude),
                  lng: parseFloat(store.longitude),
                }}
              >
                <div
                  className="relative"
                  onClick={() => {
                    setSelectedStore(store);
                    setDrawerOpen(true);
                  }}
                >
                  {/* 핀 모양 */}
                  <div className="absolute -translate-y-4 bottom-10 left-1/2 -translate-x-2">
                    <MapPin className="w-6 h-6 text-blue-500 bg-white rounded-full" />
                  </div>

                  {/* 기존 오버레이 내용 */}
                  <div className="relative bg-white w-[180px] h-[80px] rounded-lg shadow-lg translate-x-2 -translate-y-20 border-2 border-gray-200">
                    <div className="rounded-lg p-2 flex items-center justify-center gap-2">
                      <Image
                        src={'/brandmarket_logo.png'}
                        alt="brandmarket_logo"
                        width={48}
                        height={48}
                        className="bg-black rounded-lg mb-1"
                      />
                      <div className="text-sm text-foreground text-center mt-1 flex flex-col items-start">
                        {store.branch}
                        <div
                          className={`text-xs ${
                            isOpenTime(store.open_time, store.close_time)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {isOpenTime(store.open_time, store.close_time)
                            ? '영업중'
                            : '영업종료'}
                        </div>
                        <div>
                          {store.open_time} - {store.close_time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CustomOverlayMap>
            ))}
          </Map>
        )}
      </div>

      {/* 데스크톱 매장 목록 */}
      <div className="col-span-1 space-y-4 px-4 md:block hidden">
        <h2 className="text-2xl font-bold">브랜드 마켓 매장 찾기</h2>
        <KeywordButtons />
        {/* 필터 */}
        <div className="flex items-center justify-between p-4 relative">
          <span>근처 매장: {filteredStores.length} 개</span>
          <StoreListFilter
            sortType={sortType}
            setSortType={setSortType}
            items={filterOptions}
          />
        </div>

        {/* 매장 리스트 */}
        <div className="flex flex-col border-t border-gray-200 border-b overflow-y-scroll h-[calc(100vh-20rem)] pb-24">
          <div>
            {getSortedStores(storesWithDistance).map((store) => (
              <Link
                key={store.store_id}
                href={`/store/${store.store_id}`}
                className="block w-full hover:bg-gray-50"
              >
                <LocationCard
                  store_id={store.store_id}
                  name={store.branch}
                  address={store.address}
                  image={store.store_image}
                  openTime={`${store.open_time} - ${store.close_time}`}
                  isOpen={isOpenTime(store.open_time, store.close_time)}
                  distance={store.distance || ''}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 모바일 매장 목록 */}
      <div className="md:hidden block">
        {/* Drawer 열기 버튼 – Drawer 열리면 숨김 */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-white shadow-xl border-2 border-gray-200 hover:bg-gray-50 rounded-full h-10 px-4 flex items-center gap-2
                     data-[open=true]:hidden"
          data-open={drawerOpen}
        >
          <MenuIcon className="w-4 h-4" />
          <span className="text-sm">매장 목록 보기</span>
        </button>

        {/* Drawer 컴포넌트 - jotai 상태로 자동 관리 */}
        <Drawer>
          <div className="flex justify-between items-center px-4 pb-3">
            <div className="flex w-full justify-between py-3">
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-md font-semibold">
                    브랜드마켓 매장 찾기
                  </h2>
                  <small className="text-xs text-muted-foreground">
                    가까운 매장을 찾아보세요.
                  </small>
                </div>
                <StoreListFilter
                  sortType={sortType}
                  setSortType={setSortType}
                  items={filterOptions}
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-2">
            <KeywordButtons />
          </div>

          {/* 매장 리스트 */}
          <div className="flex-1 overflow-y-scroll px-4 pb-6">
            {getSortedStores(storesWithDistance).map((store) => (
              <div
                key={store.store_id}
                onClick={() => {
                  setSelectedStore(store);
                }}
                className="cursor-pointer"
              >
                <LocationCard
                  store_id={store.store_id}
                  name={store.branch}
                  address={store.address}
                  image={store.store_image}
                  openTime={`${store.open_time} - ${store.close_time}`}
                  isOpen={isOpenTime(store.open_time, store.close_time)}
                  distance={store.distance || ''}
                />
              </div>
            ))}
          </div>
        </Drawer>
      </div>

      {/* Sheet 컴포넌트 */}
      <StoreDetailSheet
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        isOpen={!!selectedStore}
      />
    </div>
  );
}
