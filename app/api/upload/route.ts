// app/api/upload/route.ts
import { serverClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await serverClient();
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const storeId = formData.get('storeId') as string;

  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: '유효한 이미지 파일이 아닙니다.' },
      { status: 400 }
    );
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${storeId}-${Date.now()}.${fileExt}`;
  const filePath = `store-cover-image/${fileName}`;

  const { error } = await supabase.storage
    .from('store-cover-image')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('업로드 실패:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('store-cover-image').getPublicUrl(filePath);

  return NextResponse.json({ publicUrl });
}
