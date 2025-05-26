// app/product/actions.ts

'use server';

import { googleVisionClient } from '@/libs/google-vision';

import { ReceiptDataType } from './types/receipt-type';

export async function detectText(base64Image: string | null) {
  try {
    if (!base64Image) {
      return {
        success: false,
        error: '이미지 데이터가 없습니다.',
      };
    }

    const [result] = await googleVisionClient.documentTextDetection({
      image: {
        content: base64Image, // data:image/... 제외한 순수 base64
      },
    });

    const fullText = result.fullTextAnnotation?.text || '';

    // 영수증 데이터 파싱
    const receiptData = parseReceiptText(fullText);

    return {
      success: true,
      text: fullText,
      parsedData: receiptData,
    };
  } catch (error) {
    console.error('문서 텍스트 감지 오류:', error);
    return {
      success: false,
      error: '문서 텍스트 감지 중 오류가 발생했습니다',
    };
  }
}

function parseReceiptText(text: string): ReceiptDataType {
  const lines = text.split('\n');
  const receiptData: ReceiptDataType = {
    storeName: '',
    items: [],
  };

  console.log('=== 전체 텍스트 라인 ===');
  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}: "${line}"`);
  });

  // 거래처명 추출
  if (lines.length > 0) {
    receiptData.storeName = lines[0].trim();
    console.log('\n=== 거래처명 ===');
    console.log(`Store Name: "${receiptData.storeName}"`);
  }

  // 품목 라인 찾기
  let startItemLine = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('품')) {
      startItemLine = i + 1;
      console.log('\n=== 품목 시작 라인 찾음 ===');
      console.log(`품목 시작 라인 번호: ${startItemLine + 1}`);
      break;
    }
  }

  console.log('\n=== 품목 파싱 시작 ===');
  // 품목 데이터 파싱
  for (let i = startItemLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      console.log(`Line ${i + 1}: 빈 라인 스킵`);
      continue;
    }

    console.log(`\n--- 라인 ${i + 1} 파싱 시작 ---`);
    console.log(`원본 라인: "${line}"`);

    // 라인 분할
    const parts = line.split(/\s+/);
    console.log('분할된 부분들:', parts);

    if (parts.length < 4) {
      console.log('데이터 부족: 최소 4개 부분 필요');
      continue;
    }

    // 끝에서부터 숫자 형식 확인
    const lastThreeParts = parts.slice(-3);
    const remainingParts = parts.slice(0, -3);

    console.log('마지막 3개 부분:', lastThreeParts);
    console.log('나머지 부분:', remainingParts);

    // 파싱 시도
    const totalPrice = parseNumberWithCommas(lastThreeParts[2]);
    const quantity = parseFloat(lastThreeParts[1]);
    const price = parseNumberWithCommas(lastThreeParts[0]);
    const itemName = remainingParts.join(' ').trim();

    console.log('파싱 결과:');
    console.log(`- 품명: "${itemName}"`);
    console.log(`- 단가: ${price}`);
    console.log(`- 수량: ${quantity}`);
    console.log(`- 금액: ${totalPrice}`);

    // 유효성 검사
    const isValid =
      itemName &&
      !isNaN(price) &&
      !isNaN(quantity) &&
      !isNaN(totalPrice) &&
      Math.abs(price * quantity - totalPrice) < 1;

    console.log('유효성 검사:', isValid ? '성공' : '실패');

    if (isValid) {
      receiptData.items.push({
        name: itemName,
        price: price,
        quantity: quantity,
        totalPrice: totalPrice,
      });
      console.log('아이템 추가됨');
    }
  }

  console.log('\n=== 최종 파싱 결과 ===');
  console.log(JSON.stringify(receiptData, null, 2));

  return receiptData;
}

// 천 단위 구분자가 있는 숫자 파싱
function parseNumberWithCommas(str: string): number {
  const parsed = parseInt(str.replace(/[^\d]/g, ''));
  console.log(`숫자 파싱: "${str}" -> ${parsed}`);
  return parsed;
}
