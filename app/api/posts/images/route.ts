import { serverClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await serverClient();
    const formData = await req.formData();

    const files = formData.getAll('files') as File[];
    const postType = formData.get('postType') as string;

    if (!files.length) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // 파일 검증
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: '이미지 파일만 업로드 가능합니다.' },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        return NextResponse.json(
          { error: '파일 크기는 10MB 이하여야 합니다.' },
          { status: 400 }
        );
      }

      // 파일명 생성
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `posts/${postType || 'general'}/${fileName}`;

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        return NextResponse.json(
          { error: `업로드 실패: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // 공개 URL 생성
      const {
        data: { publicUrl },
      } = supabase.storage.from('posts').getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `${files.length}개의 이미지가 업로드되었습니다.`,
    });
  } catch (error) {
    console.error('이미지 업로드 중 오류:', error);
    return NextResponse.json(
      { error: '업로드 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
