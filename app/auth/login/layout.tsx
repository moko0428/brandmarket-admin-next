import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Market | 관리자 로그인',
  description: 'Brand Market',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
