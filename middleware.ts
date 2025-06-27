import { NextResponse } from 'next/server';

export async function middleware() {
  // 현재는 모든 요청을 허용
  // 프로필 페이지는 각 페이지에서 인증 확인
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|public/|logo.svg|quizImage1.png|quizImage2.png|algorithmImage.png|algorithmImage2.png|images/|api/).*)',
  ],
};
