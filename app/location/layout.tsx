import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '브랜드마켓 | 맵',
  description: '브랜드마켓 맵 페이지',
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-4">{children}</div>
    </>
  );
}
