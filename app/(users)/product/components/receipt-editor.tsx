'use client';

import { useAtom } from 'jotai';
import { editableReceiptAtom, ocrResultAtom } from '../atoms/camera-atom';

export function ReceiptEditor() {
  const [ocrResult] = useAtom(ocrResultAtom);
  const [receipt, setReceipt] = useAtom(editableReceiptAtom);

  console.log(ocrResult);

  const addItem = () => {
    setReceipt((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          price: 0,
          quantity: 1,
          totalPrice: 0,
        },
      ],
    }));
  };

  const updateItem = (
    index: number,
    field: keyof (typeof receipt.items)[0],
    value: string | number
  ) => {
    setReceipt((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setReceipt((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      {/* 상점명 수정 */}
      <div>
        <label className="block text-sm font-medium">상점명</label>
        <input
          type="text"
          value={receipt.storeName}
          onChange={(e) =>
            setReceipt((prev) => ({ ...prev, storeName: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* 품목 목록 */}
      <div className="space-y-2">
        {receipt.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="품목명"
              className="flex-1"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                updateItem(index, 'price', Number(e.target.value))
              }
              placeholder="단가"
              className="w-24"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, 'quantity', Number(e.target.value))
              }
              placeholder="수량"
              className="w-20"
            />
            <span className="w-24 text-right">
              {item.price * item.quantity}원
            </span>
            <button onClick={() => removeItem(index)} className="text-red-500">
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 품목 추가 버튼 */}
      <button
        onClick={addItem}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        품목 추가
      </button>
    </div>
  );
}
