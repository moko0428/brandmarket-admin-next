'use client';
import { Button } from '@/common/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">삐빅!</h1>
      <p className="text-lg text-gray-500">
        문제가 발생했습니다. 다시 시도해주세요.
      </p>
      <Button variant="outline" onClick={() => router.back()}>
        뒤로가기
      </Button>
    </div>
  );
}
