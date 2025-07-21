import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { profileId, role } = await request.json();

    if (!profileId || !role) {
      return NextResponse.json(
        { error: '프로필 ID와 역할이 필요합니다.' },
        { status: 400 }
      );
    }

    // 유효한 역할인지 확인
    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: '유효하지 않은 역할입니다.' },
        { status: 400 }
      );
    }

    const supabase = await serverClient();

    // 현재 사용자가 관리자인지 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 현재 사용자의 역할 확인
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('profile_id', user.id)
      .single();

    if (currentUserProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자만 역할을 변경할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 역할 업데이트
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('profile_id', profileId);

    if (updateError) {
      console.error('역할 업데이트 에러:', updateError);
      return NextResponse.json(
        { error: '역할 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('역할 업데이트 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
