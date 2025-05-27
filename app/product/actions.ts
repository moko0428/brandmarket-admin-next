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
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  const receiptData: ReceiptDataType = {
    storeName: '',
    items: [],
  };

  console.log('=== 전체 텍스트 라인 ===');
  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}: "${line}"`);
  });

  // 키워드로 시작하는 라인 찾기
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^(품|단|수|금)/)) {
      startIndex = i + 1;
      console.log('\n=== 키워드 라인 발견 ===');
      console.log(`키워드 라인: "${line}"`);
      console.log(`시작 인덱스: ${startIndex}`);
      break;
    }
  }

  // 키워드 이후 라인만 추출
  const newLines = startIndex !== -1 ? lines.slice(startIndex) : [];

  console.log('\n=== 추출된 라인들 ===');
  newLines.forEach((line, index) => {
    console.log(`NewLine ${index + 1}: "${line}"`);
  });

  // 첫 번째 라인은 거래처명으로 설정
  if (lines.length > 0) {
    receiptData.storeName = lines[0];
    console.log('\n=== 거래처명 ===');
    console.log(`Store Name: "${receiptData.storeName}"`);
  }

  // 추출된 라인들에 대해서만 파싱 진행
  for (let i = 0; i < newLines.length; i++) {
    const line = newLines[i].trim();
    console.log(`\n--- 라인 ${i + 1} 파싱 시작 ---`);
    console.log(`원본 라인: "${line}"`);

    // 숫자가 포함된 라인만 처리
    if (!line.match(/\d+/)) {
      console.log('숫자가 없는 라인 스킵');
      continue;
    }

    // 라인 분할 - 공백, 탭 등으로 분리
    const parts = line.split(/[\s\t]+/);
    console.log('분할된 부분들:', parts);

    // 끝에서부터 숫자 찾기
    const numberParts: string[] = [];
    const nameParts: string[] = [];

    for (let j = parts.length - 1; j >= 0; j--) {
      // 숫자 또는 쉼표를 포함하는 부분 찾기
      if (parts[j].match(/[\d,]+/) && numberParts.length < 3) {
        numberParts.unshift(parts[j]);
      } else {
        nameParts.push(parts[j]);
      }
    }

    console.log('숫자 부분:', numberParts);
    console.log('이름 부분:', nameParts);

    // 파싱 시도
    let totalPrice, quantity, price;

    if (numberParts.length >= 3) {
      totalPrice = parseNumberWithCommas(numberParts[2]);
      quantity = parseFloat(numberParts[1]);
      price = parseNumberWithCommas(numberParts[0]);
    } else if (numberParts.length === 2) {
      totalPrice = parseNumberWithCommas(numberParts[1]);
      quantity = 1;
      price = parseNumberWithCommas(numberParts[0]);
    } else if (numberParts.length === 1) {
      totalPrice = parseNumberWithCommas(numberParts[0]);
      quantity = 1;
      price = totalPrice;
    }

    const itemName = nameParts.join(' ').trim();

    console.log('파싱 결과:');
    console.log(`- 품명: "${itemName}"`);
    console.log(`- 단가: ${price}`);
    console.log(`- 수량: ${quantity}`);
    console.log(`- 금액: ${totalPrice}`);

    // 유효성 검사
    const isValid =
      itemName &&
      price !== undefined &&
      quantity !== undefined &&
      totalPrice !== undefined &&
      price > 0 &&
      totalPrice > 0;

    console.log('유효성 검사:', isValid ? '성공' : '실패');

    if (isValid) {
      receiptData.items.push({
        name: itemName,
        price: price ?? 0,
        quantity: quantity ?? 0,
        totalPrice: totalPrice ?? 0,
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
