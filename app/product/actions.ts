'use server';

import { googleVisionClient } from '@/libs/google-vision';

interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

interface ReceiptData {
  storeName: string;
  date: string;
  items: ReceiptItem[];
  totalAmount: number;
  taxAmount?: number;
}

export async function detectText(base64Image: string | null) {
  try {
    if (!base64Image) {
      return {
        success: false,
        error: '이미지 데이터가 없습니다.',
      };
    }

    const [result] = await googleVisionClient.documentTextDetection(
      Buffer.from(base64Image, 'base64')
    );

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

function parseReceiptText(text: string): ReceiptData {
  const lines = text.split('\n');
  const receiptData: ReceiptData = {
    storeName: '',
    date: '',
    items: [],
    totalAmount: 0,
  };

  // 가격 패턴 (숫자 + 원 또는 , 포함)
  const pricePattern = /(\d{1,3}(,\d{3})*원|\d{1,3}(,\d{3})*)/;

  // 날짜 패턴 (YYYY-MM-DD 또는 YYYY/MM/DD)
  const datePattern = /\d{4}[-/]\d{2}[-/]\d{2}/;

  lines.forEach((line) => {
    // 매장명 찾기 (첫 번째 줄 또는 특정 패턴)
    if (!receiptData.storeName && line.trim()) {
      receiptData.storeName = line.trim();
    }

    // 날짜 찾기
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      receiptData.date = dateMatch[0];
    }

    // 상품 항목 찾기
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const price = parseInt(priceMatch[0].replace(/[^0-9]/g, ''));
      const itemName = line.split(priceMatch[0])[0].trim();

      if (itemName && price) {
        receiptData.items.push({
          name: itemName,
          price: price,
        });
      }
    }

    // 총액 찾기
    if (line.includes('합계') || line.includes('총액')) {
      const totalMatch = line.match(pricePattern);
      if (totalMatch) {
        receiptData.totalAmount = parseInt(
          totalMatch[0].replace(/[^0-9]/g, '')
        );
      }
    }

    // 세금 찾기
    if (line.includes('부가세') || line.includes('VAT')) {
      const taxMatch = line.match(pricePattern);
      if (taxMatch) {
        receiptData.taxAmount = parseInt(taxMatch[0].replace(/[^0-9]/g, ''));
      }
    }
  });

  return receiptData;
}
