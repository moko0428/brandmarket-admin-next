import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/common/components/navigation';
import { headers } from 'next/headers';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { serverClient } from '@/lib/supabase/server';
import { Providers } from '@/common/providers';
import BottomBar from '@/common/components/bottom-bar';

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
  const shouldShowNavigation = !referer.includes('/auth/login/a');

  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 사용자 프로필 정보 가져오기
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_id', user.id)
      .single();
    userProfile = profile;
  }

  const isLoggedIn = !!user;

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
        {shouldShowNavigation && (
          <Navigation
            isLoggedIn={isLoggedIn}
            avatar={userProfile?.avatar || ''}
            name={userProfile?.location_name}
            role={userProfile?.role}
          />
        )}
        <Providers>
          <div className="border-x-neutral-100 h-full w-full">{children}</div>
        </Providers>
        <Toaster position="top-center" richColors />
        <BottomBar />
      </body>
    </html>
  );
}
