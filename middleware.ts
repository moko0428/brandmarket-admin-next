import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from './lib/supabase/server';

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
};

export async function middleware(request: NextRequest) {
  const {
    data: { user },
  } = await (await serverClient()).auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!user;

  // 보호된 페이지에 비로그인 사용자가 접근하려는 경우
  if (!isLoggedIn && protectedUrls[pathname]) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 나머지 경우는 정상적으로 페이지 접근 허용
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|public/|logo.svg|quizImage1.png|quizImage2.png|algorithmImage.png|algorithmImage2.png|images/).*)',
  ],
};
