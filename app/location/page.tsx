'use client';

import { FilterIcon } from 'lucide-react';
// 현재 위치 받아오기
// 각 지점 위치 받아오기
// 현재 위치와 각 지점 위치 비교
// 가장 가까운 지점 찾기
// 가장 가까운 지점 표시
// 주소를 좌표값으로 변환

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { InputPair } from '@/common/components/input-pair';
import { Input } from '@/common/components/ui/input';

const positions = [
  {
    title: '브랜드마켓-홍대',
    latlng: { lat: 37.555873, lng: 126.923602 },
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
    openTime: '오픈 시간: 10:00 - 20:00',
    isOpen: true,
  },
  {
    name: '브랜드마켓 성수점',
    address: '서울특별시 성동구 성수일로 102',
    openTime: '오픈 시간: 10:00 - 20:00',
    isOpen: false,
  },
  {
    name: '브랜드마켓 강남점',
    address: '서울특별시 강남구 강남대로 102',
    openTime: '오픈 시간: 10:00 - 20:00',
    isOpen: true,
  },
  {
    name: '브랜드마켓 홍대 상상마당점',
    address: '서울특별시 마포구 홍대로 102',
    openTime: '오픈 시간: 10:00 - 20:00',
    isOpen: false,
  },
  {
    name: '브랜드마켓 강남점',
    address: '서울특별시 강남구 강남대로 102',
    openTime: '오픈 시간: 10:00 - 20:00',
    isOpen: true,
  },
];

// 필터 : 영업중

export default function LocationPage() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_API_KEY!,
  });
  const [value, setValue] = useState('');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
      <div className="col-span-2 relative">
        <div className="absolute top-4 left-4 z-10 w-full pr-6 block md:hidden">
          <div className="flex w-full justify-between rounded-lg pointer-events-auto">
            <Input
              id="search-map"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="위치 검색"
              className="bg-white w-2/3"
            />
            <Button variant="outline">
              <FilterIcon />
            </Button>
          </div>
        </div>

        <div className="w-full h-full pointer-events-auto">
          <Map
            center={{
              lat: 37.557527,
              lng: 126.925595,
            }}
            style={{
              width: '100%',
              height: '800px',
            }}
            level={3}
          >
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

      <div className="col-span-1 space-y-4 px-4 md:block hidden">
        <h2>브랜드 마켓 매장 찾기</h2>

        {/* 검색 창 */}
        <InputPair
          id="search-store"
          label="매장 위치"
          value={value}
          onChange={setValue}
        />

        {/* 필터 */}
        <div className="flex items-center justify-between p-4">
          <span>근처 매장: 5 개</span>
          <Button variant="outline">
            필터 <FilterIcon />
          </Button>
        </div>

        {/* 매장 리스트 */}
        <div className="flex flex-col gap-2 p-4 border-t border-gray-200 border-b overflow-y-scroll h-[calc(100vh-20rem)] pb-24">
          {stores.map((store, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-gray-200 pb-2"
            >
              <span className="font-bold">{store.name}</span>
              <span className="text-sm text-foreground/50">
                {store.address}
              </span>
              <div className="flex items-center gap-2">
                {store.isOpen ? (
                  <span className="text-sm text-green-500">영업중</span>
                ) : (
                  <span className="text-sm text-red-500">영업 종료</span>
                )}
                <span className="text-sm">{store.openTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
