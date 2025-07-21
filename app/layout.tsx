import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/common/components/navigation';
import Script from 'next/script';
import { Toaster } from 'sonner';
import BottomBar from '@/common/components/bottom-bar';
import Container from '@/common/components/container';

export const metadata: Metadata = {
  title: 'Brand Market',
  description: 'Brand Market',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Brand Market',
  },
  applicationName: 'Brand Market',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/192x192.png', sizes: '192x192' },
      { url: '/512x512.png', sizes: '512x512' },
    ],
    apple: '/192x192.png',
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
  return (
    <html lang="ko">
      <head>
        {/* 광고 코드 */}
        {/* <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.AD_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GCODE}`}
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', "${process.env.GCODE}", {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navigation />
        <Container>
          <div className="pt-14">{children}</div>
          <Toaster position="top-center" richColors />
        </Container>
        <BottomBar />
      </body>
    </html>
  );
}
