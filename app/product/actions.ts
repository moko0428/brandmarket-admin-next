'use server';

import { googleVisionClient } from '@/libs/google-vision';

import { ReceiptDataType, ReceiptItemType } from './types/receipt-type';

import {
  ITEM_NAME_PATTERN,
  PRICE_PATTERN,
  QUANTITY_PATTERN,
} from './patterns/receiptPattern';

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

  console.log('\n=== 파싱 시작 ===');
  console.log('전체 라인 수:', lines.length);
  console.log('입력된 라인들:', lines);

  let currentItem: Partial<ReceiptItemType> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    console.log(`\n--- 라인 ${i + 1} 파싱 시작 ---`);
    console.log(`원본 라인: "${line}"`);

    // 품명 패턴 검사
    if (ITEM_NAME_PATTERN.test(line) && !PRICE_PATTERN.test(line)) {
      // 이전 아이템이 있다면 저장
      if (currentItem.name) {
        console.log('\n>>> 이전 아이템 저장 <<<');
        tryAddItem(currentItem, receiptData);
      }

      // 새 아이템 시작
      currentItem = {
        name: line,
        price: 1,
        quantity: 1,
        totalPrice: 1,
      };
      console.log('새 품명 설정됨:', currentItem);
      continue;
    }

    // 단가 패턴 검사
    if (PRICE_PATTERN.test(line) && currentItem.name) {
      currentItem.price = parseNumberWithCommas(line);
      currentItem.totalPrice = currentItem.price * (currentItem.quantity || 1);
      console.log('단가 설정됨:', currentItem);
      continue;
    }

    // 수량 패턴 검사
    if (QUANTITY_PATTERN.test(line) && currentItem.name) {
      currentItem.quantity = parseFloat(line);
      if (currentItem.price) {
        currentItem.totalPrice = currentItem.price * currentItem.quantity;
      }
      console.log('수량 설정됨:', currentItem);
      continue;
    }

    // 총액 패턴 검사
    if (PRICE_PATTERN.test(line) && currentItem.name) {
      currentItem.totalPrice = parseNumberWithCommas(line);
      // 단가가 없으면 총액/수량으로 계산
      if (!currentItem.price && currentItem.quantity) {
        currentItem.price = Math.round(
          currentItem.totalPrice / currentItem.quantity
        );
      }
      console.log('총액 설정됨:', currentItem);

      // 아이템 저장 후 초기화
      tryAddItem(currentItem, receiptData);
      currentItem = {};
    }
  }

  // 마지막 아이템 처리
  if (currentItem.name) {
    console.log('\n>>> 마지막 아이템 저장 <<<');
    tryAddItem(currentItem, receiptData);
  }

  console.log('\n=== 최종 파싱 결과 ===');
  console.log('총 아이템 수:', receiptData.items.length);
  receiptData.items.forEach((item, index) => {
    console.log(`\n아이템 #${index + 1}:`);
    console.log('- 품명:', item.name);
    console.log('- 단가:', item.price.toLocaleString());
    console.log('- 수량:', item.quantity);
    console.log('- 금액:', item.totalPrice.toLocaleString());
  });

  return receiptData;
}

function tryAddItem(
  item: Partial<ReceiptItemType>,
  receiptData: ReceiptDataType
) {
  console.log('\n>>> 아이템 추가 시도 <<<');
  console.log('추가할 아이템:', item);

  const completeItem = {
    name: item.name || '상품명 없음',
    price: item.price || 1,
    quantity: item.quantity || 1,
    totalPrice: item.totalPrice || item.price || 1,
  };

  console.log('기본값 설정 후:', completeItem);
  receiptData.items.push(completeItem);
  console.log('✅ 아이템 추가됨');
}

function parseNumberWithCommas(str: string): number {
  const parsed = parseInt(str.replace(/[^\d]/g, ''));
  console.log(`숫자 파싱: "${str}" -> ${parsed}`);
  return parsed;
}
