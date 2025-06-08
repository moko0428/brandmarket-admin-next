import EditTable from './components/edit-table';
import { InventoryList } from './components/inventory-list';
import { Hero } from '@/common/components/hero';

const textResult = {
  parsedData: {
    items: [
      { name: '상품1', price: 1000, quantity: 10, totalPrice: 10000 },
      { name: '상품2', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품2', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품4', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품5', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품6', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품7', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품8', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품9', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품10', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품1', price: 1000, quantity: 10, totalPrice: 10000 },
      { name: '상품2', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품2', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품4', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품5', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품6', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품7', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품8', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품9', price: 2000, quantity: 20, totalPrice: 40000 },
      { name: '상품10', price: 2000, quantity: 20, totalPrice: 40000 },
    ],
  },
};
export default function ProductPage() {
  return (
    <div className="px-10 h-screen">
      <Hero
        title="재고 관리"
        subtitle="재고 관리 테이블을 통해 재고를 관리합니다."
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2 justify-between bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between gap-2 border-b-2 border-gray-200 pb-2">
            <div>품명</div>
            <div>단가</div>
            <div>수량</div>
            <div>총 가격</div>
          </div>
          <div className="overflow-y-auto h-[550px]">
            {textResult.parsedData.items.map((item, index) => (
              <InventoryList key={index} {...item} />
            ))}
          </div>
        </div>
        <div>
          <EditTable />
        </div>
      </div>
    </div>
  );
}
