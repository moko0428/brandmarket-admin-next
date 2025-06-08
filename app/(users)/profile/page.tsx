import { Hero } from '@/common/components/hero';
import { MapPin } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="px-10 h-screen">
      <Hero title="매장 정보 관리" subtitle="매장 정보를 관리할 수 있습니다." />
      <aside className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">매장 이름</h2>
            <span className="text-sm text-gray-500">브랜드마켓 - 성수점</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">매장 소개</h2>
            <span className="text-sm text-gray-500">
              브랜드마켓은 성수점에서 매장 정보를 관리할 수 있습니다.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">매장 주소</h2>
            <span className="text-sm text-gray-500">
              서울특별시 성동구 성수일로 102
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              위도 : 37.5112138
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              경도 : 127.0276362
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">영업시간</h2>
            <span className="text-sm text-gray-500">10:00 ~ 20:00</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">전화번호</h2>
            <span className="text-sm text-gray-500">02-1234-5678</span>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <div>매장 이미지</div>
            <div></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
