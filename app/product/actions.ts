'use server';

import { ClientVision } from '@/libs/google-vision';

export async function detectText(base64Image: string | null) {
  try {
    if (!base64Image) {
      return {
        success: false,
        error: '이미지 데이터가 없습니다..',
      };
    }

    const [result] = await ClientVision.textDetection(
      Buffer.from(base64Image, 'base64')
    );

    const detections = result.textAnnotations;
    const fullText =
      detections && detections.length > 0 ? detections[0].description : '';

    return {
      success: true,
      text: fullText,
      detections: detections,
    };
  } catch (error) {
    console.error('텍스트 감지 오류:', error);
    return {
      success: false,
      error: '텍스트 감지 중 오류가 발생했습니다',
    };
  }
}
