import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Market | 로그인',
  description: 'Brand Market',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full flex flex-col">{children}</div>;
}
