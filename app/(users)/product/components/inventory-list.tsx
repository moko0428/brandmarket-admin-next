'use client';

interface ReceiptItemProps {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  className?: string;
}

export function InventoryList({
  name,
  price,
  quantity,
  totalPrice,
  className = '',
}: ReceiptItemProps) {
  return (
    <ul className={`py-3 ${className}`}>
      <li className="flex justify-between items-center border-b-1 border-gray-200 pb-2">
        <div className="font-medium">{name}</div>
        <div className="text-gray-600">{price.toLocaleString()}</div>
        <div className="text-gray-600">{quantity}</div>
        <div className="font-semibold">{totalPrice.toLocaleString()}</div>
      </li>
    </ul>
  );
}
