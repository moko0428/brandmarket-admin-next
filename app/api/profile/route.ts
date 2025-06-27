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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error } = await supabase.storage
      .from('profile')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('프로필 이미지 업로드 실패:', error.message);
      return NextResponse.json(
        { error: `업로드 실패: ${error.message}` },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('profile').getPublicUrl(filePath);

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('프로필 이미지 업로드 중 오류:', error);
    return NextResponse.json(
      { error: '업로드 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
