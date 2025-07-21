import { serverClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await serverClient();
    const formData = await req.formData();

    const file = formData.get('file') as File;
    const profileId = formData.get('profileId') as string;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '유효한 이미지 파일이 아닙니다.' },
        { status: 400 }
      );
    }

    if (!profileId) {
      return NextResponse.json(
        { error: '프로필 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 500 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    // 1. 스토리지에 업로드
    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('프로필 이미지 업로드 실패:', uploadError.message);
      return NextResponse.json(
        { error: `업로드 실패: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 2. 공개 URL 생성 (캐시 버스팅 추가)
    const {
      data: { publicUrl },
    } = supabase.storage.from('profile').getPublicUrl(filePath);

    const timestamp = Date.now();
    const publicUrlWithCache = `${publicUrl}?t=${timestamp}`;

    // 3. 데이터베이스 업데이트 (중요!)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar: publicUrlWithCache,
        updatedAt: new Date().toISOString(),
      })
      .eq('profile_id', profileId);

    if (updateError) {
      console.error('프로필 데이터베이스 업데이트 실패:', updateError.message);
      // 업로드된 파일 정리
      await supabase.storage.from('profile').remove([filePath]);
      return NextResponse.json(
        { error: `데이터베이스 업데이트 실패: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log('프로필 이미지 업로드 및 DB 업데이트 성공:', profileId);

    return NextResponse.json({
      publicUrl: publicUrlWithCache,
      message: '프로필 이미지가 성공적으로 업로드되었습니다.',
    });
  } catch (error) {
    console.error('프로필 이미지 업로드 중 오류:', error);
    return NextResponse.json(
      { error: '업로드 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
