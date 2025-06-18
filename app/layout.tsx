import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/common/components/navigation';
import { headers } from 'next/headers';
import Script from 'next/script';

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
  const headersList = await headers();
  const referer = headersList.get('referer') || '';
  const shouldShowNavigation = !referer.includes('/auth');

  return (
    <html lang="ko">
      <head>
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
              gtag('config', '${process.env.GCODE}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {shouldShowNavigation && (
          <Navigation
            isLoggedIn={false}
            avatar="https://github.com/shadcn.png"
            name="Brand Market"
            storename="Brand Market"
            role="관리자"
          />
        )}
        <div className="border-x-neutral-100 h-full w-full">{children}</div>
      </body>
    </html>
  );
}
