'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id; // URL의 [id] 부분이 여기로 들어옵니다

  return (
    <div className="flex flex-col gap-4">
      <Link href="/location">뒤로가기</Link>
      <h1 className="text-2xl font-bold">매장 상세 페이지</h1>
      <p className="text-sm text-gray-500">매장 ID: {storeId}</p>
    </div>
  );
}
