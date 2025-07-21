import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Market | 마이페이지',
  description: 'Brand Market',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
