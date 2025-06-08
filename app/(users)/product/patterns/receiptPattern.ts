// 단가 패턴
export const PRICE_PATTERN = /\b\d{1,3}(,\d{3})*\b/; // 1~3 + (쉼표 3자리) 반복

// 수량 패턴
export const QUANTITY_PATTERN = /\b(100|[1-9]?[0-9])\b/; // 100 또는 1~99

// 품명 패턴
export const ITEM_NAME_PATTERN = /[가-힣a-zA-Z0-9\s()/\-]+/; // 한글, 영어, 숫자, 공백, 괄호, 슬래시, 대시
