import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '브랜드마켓 매장 상세 페이지',
  description: '브랜드마켓 매장 상세 페이지',
};

export default function StoreDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="py-0 md:py-4 px-0">{children}</div>
    </>
  );
}
