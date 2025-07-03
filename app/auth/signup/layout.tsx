import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Market | 회원가입',
  description: 'Brand Market',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
