import { Hero } from '@/common/components/hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Hero
        title="Brand Market"
        subtitle="Brand Market에 오신 것을 환영합니다."
      />
      <div className="block md:hidden w-full h-full">
        <div className="flex justify-center items-center h-full">
          <div className="underline hover:text-blue-500">
            <Link href="/location">
              브랜드마켓 매장 위치 확인하러 가기 &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
