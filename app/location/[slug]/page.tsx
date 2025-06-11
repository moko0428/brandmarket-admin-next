'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { detailStoreList } from '../components/store-detail-sheet';

export default function StoreDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const store = detailStoreList.find((s) => {
    const storeSlug = s.name
      .replace('브랜드마켓 ', '')
      .replace('점', '')
      .toLowerCase()
      .replace(/\s+/g, '-');

    console.log('Comparing:', storeSlug, 'with:', slug);
    return storeSlug === slug;
  });

  if (!store) {
    return (
      <div className="container mx-auto py-8">
        <Link
          href="/location"
          className="text-blue-500 hover:underline mb-4 block"
        >
          ← 뒤로가기
        </Link>
        <div>매장을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href="/location"
        className="text-blue-500 hover:underline mb-4 block"
      >
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
          </div>

          <div>
            <h2 className="text-xl font-semibold">영업시간</h2>
            <p className="text-gray-600">{store.openTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
