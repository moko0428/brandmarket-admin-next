'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getStoreById } from '../../action';
import { Store } from '../../atoms/drawer-atom';
import { Skeleton } from '@/common/components/ui/skeleton';
import { toast } from 'sonner';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStore = async () => {
      if (!storeId) return;

      try {
        setLoading(true);
        const storeData = await getStoreById(storeId);

        if (storeData) {
          setStore(storeData);
        } else {
          setError('매장을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('매장 데이터 로드 에러:', err);
        setError('매장 정보를 불러오는데 실패했습니다.');
        toast.error('매장 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [storeId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">
          ← 뒤로가기
        </Link>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container mx-auto py-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">
          ← 뒤로가기
        </Link>
        <div className="text-center py-8">
          <p className="text-gray-600">{error || '매장을 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← 뒤로가기
      </Link>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{store.branch}</h1>

        <div className="rounded-lg overflow-hidden">
          <Image
            src={store.store_image || '/brandmarket_logo.png'}
            alt={store.branch}
            width={800}
            height={400}
            className="w-[300px] h-[300px] object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">주소</h2>
            <p className="text-gray-600">{store.address}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>위치: {store.location}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">영업시간</h2>
            <p className="text-gray-600">
              {store.open_time} - {store.close_time}
            </p>
          </div>

          {store.description && (
            <div>
              <h2 className="text-xl font-semibold">설명</h2>
              <p className="text-gray-600">{store.description}</p>
            </div>
          )}

          {store.directions && store.directions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">오시는 길</h2>
              {store.directions.map((direction, index) => (
                <p key={index} className="text-gray-600">
                  {direction}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
