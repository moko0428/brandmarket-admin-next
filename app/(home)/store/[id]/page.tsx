'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { detailStoreList } from '@/data/store';

export default function StoreDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const store = detailStoreList.find((s) => s.id === id);

  if (!store) {
    return (
      <div className="container mx-auto py-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">
          ← 뒤로가기
        </Link>
        <div>매장을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← 뒤로가기
      </Link>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{store.name}</h1>

        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={store.image || '/assets/images/logo/brandmarket_logo.png'}
            alt={store.name}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">주소</h2>
            <p className="text-gray-600">{store.address}</p>
            {store.copy.map((address, index) => (
              <div key={index} className="mt-2 text-sm text-gray-500">
                <p>도로명: {address.copy_road}</p>
                <p>지번: {address.copy_street}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold">영업시간</h2>
            <p className="text-gray-600">{store.openTime}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">오시는 길</h2>
            {store.place.map((direction, index) => (
              <p key={index} className="text-gray-600">
                {direction}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
