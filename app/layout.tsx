import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/common/components/navigation';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: '브랜드마켓 관리자 패널',
  description: '브랜드마켓 관리자 패널',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: '브랜드마켓 관리자 패널',
  },
  applicationName: '브랜드마켓 관리자 패널',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/brand_market_192x192.png', sizes: '192x192' },
      { url: '/brand_market_512x512.png', sizes: '512x512' },
    ],
    apple: '/brand_market_192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const referer = headersList.get('referer') || '';
  const shouldShowNavigation = !referer.includes('/auth');

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        {shouldShowNavigation && (
          <Navigation
            isLoggedIn={false}
            avatar="https://github.com/shadcn.png"
            name="성수점"
            storename="브랜드마켓"
            role="관리자"
          />
        )}
        <div className="border-x-neutral-100 h-full w-full">{children}</div>
      </body>
    </html>
  );
}
