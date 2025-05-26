export type ReceiptItemType = {
  name: string; //품명
  price: number; // 단가
  quantity: number; // 수량
  totalPrice: number; // 금액
};

export type ReceiptDataType = {
  storeName: string; // 매장명(거래처)
  items: ReceiptItemType[];
};
