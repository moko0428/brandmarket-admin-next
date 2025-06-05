'use client';
// 현재 위치 받아오기 :✅
// 각 지점 위치 받아오기 :✅
// 현재 위치와 각 지점 위치 비교 :✅
// 가장 가까운 지점 찾기 :✅
// 가장 가까운 지점 표시 :✅
import { RefreshCw } from 'lucide-react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { InputPair } from '@/common/components/input-pair';
import { Input } from '@/common/components/ui/input';
import LocationCard from './components/location-card';
import { DateTime } from 'luxon';
import { CURRENT_LOCATION_LAT, CURRENT_LOCATION_LNG } from './constants';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/common/components/ui/drawer';
import { StoreListFilter } from './components/store-list-filter';

import { LocationMenu } from './components/location-menu';

const positions = [
  {
    title: '브랜드마켓-홍대',
    latlng: { lat: 37.555409, lng: 126.920432 },
  },
  {
    title: '브랜드마켓-성수',
    latlng: {
      lat: 37.541735,
      lng: 127.044697,
    },
  },
  {
    title: '브랜드마켓-강남',
    latlng: {
      lat: 37.496791,
      lng: 127.029337,
    },
  },
  {
    title: '브랜드마켓-홍대 상상마당',
    latlng: {
      lat: 37.549711,
      lng: 126.920564,
    },
  },
];

const stores = [
  {
    name: '브랜드마켓 홍대점',
    address: '서울특별시 마포구 홍대로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
    name: '브랜드마켓 성수점',
    address: '서울특별시 성동구 성수일로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
    name: '브랜드마켓 강남점',
    address: '서울특별시 강남구 강남대로 102',
    openTime: '10:00 - 20:00',
    image: '',
  },
  {
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

  // 매장 이름으로 positions에서 위치 찾기
  const findStorePosition = (storeName: string) => {
    // 매장 이름에서 "브랜드마켓" 부분을 제거하고 positions 데이터와 매칭

    const position = positions.find((pos) =>
      pos.title.toLowerCase().includes(storeName.toLowerCase())
    );
    return position?.latlng;
  };

  // LocationCard 클릭 핸들러
  const handleCardClick = (storeName: string) => {
    const cleanStoreName = storeName
      .replace('브랜드마켓 ', '')
      .replace('점', '');
    const position = findStorePosition(cleanStoreName);
    if (position) {
      setMapCenter(position);
    }
  };

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
            lat: 37.557527,
            lng: 126.925595,
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
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
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
        {/* 모바일 검색 바 */}
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-10 w-[95%] block md:hidden">
          <div className="flex w-full h-12 justify-between items-center bg-white px-2 rounded-lg pointer-events-auto shadow-md gap-2">
            <div className="flex w-full items-center">
              <LocationMenu />
              <Input
                id="search-map"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="위치 검색 (예: 홍대, 성수, 강남)"
                className="flex-1 bg-white w-full border-none shadow-none"
              />
            </div>
            <Drawer shouldScaleBackground>
              <DrawerTrigger>
                <Button variant="ghost">매장 리스트</Button>
              </DrawerTrigger>
              <DrawerContent className="w-full flex flex-col rounded-t-[10px]">
                <DrawerHeader>
                  <div className="flex justify-between items-center">
                    <DrawerTitle>브랜드마켓 매장 찾기</DrawerTitle>
                    <StoreListFilter
                      sortType={sortType}
                      setSortType={setSortType}
                      items={filterOptions}
                    />
                  </div>
                  <DrawerDescription>
                    가까운 매장을 찾아보세요
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4">
                  {/* 매장 리스트 */}
                  {getSortedStores(storesWithDistance).map((store, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(store.name)}
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
              </DrawerContent>
            </Drawer>
          </div>
        </div>
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
              height: '800px',
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

            {/* 매장 위치 마커 */}
            {positions.map((position, index) => (
              <MapMarker
                key={index}
                position={position.latlng}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                  size: {
                    width: 24,
                    height: 35,
                  },
                }}
                title={position.title}
              />
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
            {getSortedStores(storesWithDistance).map((store, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(store.name)}
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

      {/* 모바일 매장 목록 */}
      <div className="col-span-2 space-y-4 px-4 block md:hidden">
        <h2 className="text-2xl font-bold">브랜드 마켓 매장 찾기</h2>

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
            {getSortedStores(storesWithDistance).map((store, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(store.name)}
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
    </div>
  );
}
