import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

interface Routes {
  [key: string]: boolean;
}

// 로그인이 필요하지 않는 페이지
// const publicOnlyUrls: Routes = {
//   '/': true,
//   '/auth/login': true,
// };

// 로그인한 사용자만 접근 가능한 페이지
const protectedUrls: Routes = {
  '/profile': true,
  '/store': true,
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!user;

  // 보호된 페이지에 비로그인 사용자가 접근하려는 경우
  if (!isLoggedIn && protectedUrls[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 홈페이지와 매장 상세 페이지는 모든 사용자에게 허용
  if (pathname === '/' || pathname.startsWith('/store/')) {
    return supabaseResponse;
  }

  // 나머지 경우는 정상적으로 페이지 접근 허용
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|public/|logo.svg|quizImage1.png|quizImage2.png|algorithmImage.png|algorithmImage2.png|images/|api/).*)',
  ],
};
