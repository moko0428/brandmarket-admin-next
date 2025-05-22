import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="mx-auto max-w-2xl h-screen border-x border-x-neutral-100 px-4 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
