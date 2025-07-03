import { serverClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await serverClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (user && !error) {
      // 이메일 확인 후 프로필 생성
      try {
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            profile_id: user.id,
            location_name: user.user_metadata?.location_name || '사용자',
            role: user.user_metadata?.role || 'user',
            avatar: user.user_metadata?.avatar || null,
          },
          {
            onConflict: 'profile_id',
            ignoreDuplicates: false,
          }
        );

        if (profileError) {
          console.error('프로필 생성 에러:', profileError);
        }
      } catch (profileError) {
        console.error('프로필 생성 중 예외:', profileError);
      }
    }
  }

  // 이메일 확인 후 로그인 페이지로 리다이렉트
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/login?message=${encodeURIComponent(
      '이메일이 확인되었습니다. 로그인해주세요.'
    )}`
  );
}
