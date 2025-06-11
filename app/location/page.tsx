'use client';
// 현재 위치 받아오기 :✅
// 각 지점 위치 받아오기 :✅
// 현재 위치와 각 지점 위치 비교 :✅
// 가장 가까운 지점 찾기 :✅
// 가장 가까운 지점 표시 :✅
import { MapPin, RefreshCw } from 'lucide-react';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { InputPair } from '@/common/components/input-pair';
import LocationCard from './components/location-card';
import { DateTime } from 'luxon';
import { CURRENT_LOCATION_LAT, CURRENT_LOCATION_LNG } from './constants';

import { StoreListFilter } from './components/store-list-filter';

import Image from 'next/image';
import StoreDetailSheet from './components/store-detail-sheet';
import Link from 'next/link';

const positions = [
  {
    title: '브랜드마켓-홍대',
    latlng: { lat: 37.55566928369786, lng: 126.92311262723686 },
  },
  {
    title: '브랜드마켓-성수',
    latlng: {
      lat: 37.54406975675041,
      lng: 127.05024699007517,
    },
  },
  {
    title: '브랜드마켓-강남',
    latlng: {
      lat: 37.50093292254849,
      lng: 127.02667251879825,
    },
  },
  {
    title: '브랜드마켓-홍대 상상마당',
    latlng: {
      lat: 37.55185463006174,
      lng: 126.92132000574637,
    },
  },
];

export const stores = [
  {
    id: 1,
    name: '브랜드마켓 홍대점',
    address: '서울특별시 마포구 홍대로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
    id: 2,
    name: '브랜드마켓 성수점',
    address: '서울특별시 성동구 성수일로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
    id: 3,
    name: '브랜드마켓 강남점',
    address: '서울특별시 강남구 강남대로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
    id: 4,
    name: '브랜드마켓 홍대 상상마당점',
    address: '서울특별시 마포구 홍대로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
];

const filterOptions = [
  { label: '거리순', value: 'distance' },
  { label: '영업상태순', value: 'status' },
  { label: '기본순', value: 'none' },
];

export type Store = {
  id: number;
  name: string;
  address: string;
  openTime: string;
  image: string;
};

// 거리 포맷팅 함수
const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance * 10) / 10}km`;
};

export default function LocationPage() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_API_KEY!,
  });
  const [value, setValue] = useState('');
  const [mapCenter, setMapCenter] = useState({
    lat: CURRENT_LOCATION_LAT,
    lng: CURRENT_LOCATION_LNG,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredStores, setFilteredStores] = useState(stores);
  const [distances, setDistances] = useState<{ [key: string]: number }>({});
  const [sortType, setSortType] = useState<'distance' | 'status' | 'none'>(
    'none'
  );
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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
    if (currentLocation) {
      const newDistances = positions.reduce((acc, position) => {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          position.latlng.lat,
          position.latlng.lng
        );
        return {
          ...acc,
          [position.title]: Math.round(distance * 10) / 10,
        };
      }, {});
      setDistances(newDistances);
    }
  }, [currentLocation]);

  // 현재 위치 새로고침 함수
  const handleRefreshLocation = () => {
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
          console.error('삐빅 현재 위치 새로고침 에러:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };

  if (loading)
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
    // 검색어가 비어있으면 현재 위치로 복귀
    if (!searchValue.trim()) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // 위치 가져오기 실패시 기본값으로 설정
          setMapCenter({
            lat: 37.55566928369786,
            lng: 126.92311262723686,
          });
        }
      );
      return;
    }

    // positions 데이터에서 검색어와 일치하는 위치 찾기
    const foundPosition = positions.find((position) =>
      position.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    // 일치하는 위치가 있으면 지도 중심점 변경
    if (foundPosition) {
      setMapCenter(foundPosition.latlng);
    }
  };

  const isOpenTime = (openTimeStr: string) => {
    const now = DateTime.now();
    const [startTime, endTime] = openTimeStr.split(' - ');

    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);

    const currentHour = now.hour;

    return currentHour >= startHour && currentHour < endHour;
  };

  const handleSearch = (searchValue: string) => {
    // 지도 중심점 변경
    handleStoreSearch(searchValue);

    // stores 필터링
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        store.address.toLowerCase().includes(searchValue.toLowerCase())
    );

    // 영업중인 매장을 위로 정렬
    const sortedStores = [...filtered].sort((a, b) => {
      const isAOpen = isOpenTime(a.openTime);
      const isBOpen = isOpenTime(b.openTime);

      if (isAOpen && !isBOpen) return -1;
      if (!isAOpen && isBOpen) return 1;
      return 0;
    });

    setFilteredStores(searchValue.trim() ? sortedStores : stores);
  };

  // 거리 계산 함수
  const storesWithDistance = filteredStores.map((store) => {
    const storeName = store.name.replace('브랜드마켓 ', '').replace('점', '');
    const matchingPosition = positions.find((pos) =>
      pos.title.includes(storeName)
    );
    const distance = matchingPosition
      ? distances[matchingPosition.title]
      : null;

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
          const isAOpen = isOpenTime(a.openTime);
          const isBOpen = isOpenTime(b.openTime);
          if (isAOpen && !isBOpen) return -1;
          if (!isAOpen && isBOpen) return 1;
          return 0;
        });
      default:
        return stores;
    }
  };

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 max-h-[calc(100vh-14rem)] h-[calc(100vh-14rem)] min-h-full">
      <div className="col-span-2 relative">
        {/* 현재 위치 새로고침 버튼 (맵) */}
        <div className="absolute bottom-100 right-4 z-10 md:top-4 md:right-4 md:block hidden">
          <Button
            variant="outline"
            onClick={handleRefreshLocation}
            className="bg-white hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            현재 위치
          </Button>
        </div>

        <div className="w-full h-full pointer-events-auto">
          <Map
            center={mapCenter}
            style={{
              width: '100%',
              height: '100%',
            }}
            level={3}
          >
            {/* 현재 위치 마커 */}
            {currentLocation && (
              <MapMarker
                position={currentLocation}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                  size: {
                    width: 24,
                    height: 35,
                  },
                }}
                title="현재 위치"
              />
            )}

            {positions.map((position, index) => (
              <CustomOverlayMap key={index} position={position.latlng}>
                <div className="relative">
                  {/* 핀 모양 */}
                  <div className="absolute  -translate-y-4 bottom-10 left-1/2 -translate-x-2">
                    <MapPin className="w-6 h-6 text-blue-500 bg-white rounded-full" />
                  </div>

                  {/* 기존 오버레이 내용 */}
                  <div className="relative bg-white w-[180px] h-[80px] rounded-lg shadow-lg translate-x-2 -translate-y-20 border-2 border-gray-200">
                    <div className="rounded-lg p-2 flex items-center justify-center gap-2">
                      <Image
                        src={'/assets/images/logo/brandmarket_logo.png'}
                        alt="brandmarket_logo"
                        width={48}
                        height={48}
                        className="bg-black rounded-lg mb-1"
                      />
                      {stores
                        .filter((store) => {
                          const storeName = store.name
                            .replace('브랜드마켓 ', '')
                            .replace('점', '');
                          const matchingPosition = positions.find((pos) =>
                            pos.title.includes(storeName)
                          );
                          return matchingPosition?.title === position.title;
                        })
                        .map((store) => (
                          <div
                            key={store.id}
                            className="text-sm text-foreground text-center mt-1 flex flex-col items-start"
                          >
                            {store.name.slice(5)}
                            <div
                              className={`text-xs ${
                                isOpenTime(store.openTime)
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {isOpenTime(store.openTime)
                                ? '영업중'
                                : '영업종료'}
                            </div>
                            <div>{store.openTime}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CustomOverlayMap>
            ))}
          </Map>
        </div>
      </div>

      {/* 데스크톱 매장 목록 */}
      <div className="col-span-1 space-y-4 px-4 md:block hidden">
        <h2 className="text-2xl font-bold">브랜드 마켓 매장 찾기</h2>

        {/* 검색 창 */}
        <InputPair
          id="search-store"
          label="매장 위치"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handleSearch(newValue);
          }}
        />

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
            {getSortedStores(storesWithDistance).map((store, index) => {
              const storeSlug = store.name
                .replace('브랜드마켓 ', '')
                .replace('점', '')
                .toLowerCase()
                .replace(/\s+/g, '-');

              return (
                <Link
                  key={index}
                  href={`/location/${storeSlug}`}
                  className="block w-full hover:bg-gray-50"
                >
                  <LocationCard
                    id={index}
                    name={store.name}
                    address={store.address}
                    image={store.image}
                    openTime={store.openTime}
                    isOpen={isOpenTime(store.openTime)}
                    distance={store.distance || ''}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 모바일 매장 목록 */}
      <div className="fixed bottom-0 w-full h-[40vh] bg-white border-t border-gray-200 rounded-t-[10px] shadow-xl z-10 overflow-hidden md:hidden block">
        <div className="flex flex-col h-full">
          <div className="flex-none px-4 py-3">
            <div className="flex justify-between items-center pb-4">
              <div>
                <h2 className="text-xl font-semibold">브랜드마켓 매장 찾기</h2>
                <p className="text-sm text-muted-foreground">
                  가까운 매장을 찾아보세요
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="p-0"
                  onClick={handleRefreshLocation}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <StoreListFilter
                  sortType={sortType}
                  setSortType={setSortType}
                  items={filterOptions}
                />
              </div>
            </div>
            <InputPair
              id="search-store"
              label="매장 검색"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                handleSearch(newValue);
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {getSortedStores(storesWithDistance).map((store, index) => (
              <div
                key={index}
                onClick={() => setSelectedStore(store)}
                className="cursor-pointer"
              >
                <LocationCard
                  id={index}
                  name={store.name}
                  address={store.address}
                  image={store.image}
                  openTime={store.openTime}
                  isOpen={isOpenTime(store.openTime)}
                  distance={store.distance || ''}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet 컴포넌트 */}
      <StoreDetailSheet
        id={selectedStore?.id || 0}
        onClose={() => setSelectedStore(null)}
        isOpen={!!selectedStore}
      />
    </div>
  );
}
