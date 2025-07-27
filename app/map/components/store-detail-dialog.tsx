import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Skeleton } from '@/common/components/ui/skeleton';
import ImagePair from './imagePair';
import { toast } from 'sonner';
import { Store } from '../atoms/drawer-atom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Separator } from '@/common/components/ui/separator';
import { StoreProductCard } from '@/app/(users)/posts/components/store-product-card';
import { getStoreProducts } from '@/app/(users)/posts/action';

interface StoreDetailSheetProps {
  store: Store | null;
  onClose: () => void;
  isOpen: boolean;
  storeOpenTime: boolean;
}

interface StoreProduct {
  post_id: string;
  title: string;
  images: string[];
  product_name: string;
  price: number;
  size: string;
  color: string;
  created_at: string;
}

export default function StoreDetailDialog({
  store,
  onClose,
  isOpen,
  storeOpenTime,
}: StoreDetailSheetProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleCopy = (text: string) => {
    toast.success('복사되었습니다.');
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const openAdressMenu = () => {
    setOpen((prev) => !prev);
  };

  // 매장 상품 로드
  useEffect(() => {
    if (!store?.store_id || !isOpen) return;

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const result = await getStoreProducts(store.store_id);
        if (result.success) {
          setProducts(result.data as StoreProduct[]);
        } else {
          console.error('상품 로드 실패:', result.error);
        }
      } catch (error) {
        console.error('상품 로드 에러:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [store?.store_id, isOpen]);

  // 매장이 없으면 렌더링하지 않음
  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{store.branch}</DialogTitle>
          <DialogDescription>{store.address}</DialogDescription>
          <Separator />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            {/* 매장 이미지 */}
            <div className="rounded-lg overflow-hidden mb-6">
              {store.store_image ? (
                <ImagePair image={store.store_image} name={store.branch} />
              ) : (
                <Skeleton className="w-full h-70" />
              )}
            </div>

            {/* 매장 정보 */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground flex items-center gap-2">
                  영업 시간{' '}
                  <div className="text-xs text-foreground/70 inline-block">
                    {storeOpenTime ? (
                      <div className="size-2 rounded-full bg-green-500" />
                    ) : (
                      <div className="size-2 rounded-full bg-red-500" />
                    )}
                  </div>
                </h3>
                <p className="text-xs text-foreground/70">
                  {store.open_time} - {store.close_time}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">
                  주소
                </h3>
                <DropdownMenu open={open} onOpenChange={openAdressMenu}>
                  <DropdownMenuTrigger className="flex items-center">
                    <p className="flex items-center">{store.address}</p>
                    {open ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => handleCopy(store.address)}
                      className="flex items-center justify-between gap-2 cursor-pointer hover:bg-transparent"
                    >
                      <p className="text-xs text-foreground/70">
                        {store.address}
                      </p>
                      {copied === store.address ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopy(store.location)}
                      className="flex items-center justify-between gap-2 cursor-pointer hover:bg-transparent"
                    >
                      <p className="text-xs text-foreground/70">
                        {store.location}
                      </p>
                      {copied === store.location ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {store.description && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-foreground">
                    설명
                  </h3>
                  <p className="text-xs text-foreground/70">
                    {store.description}
                  </p>
                </div>
              )}

              {store.directions && store.directions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-foreground">
                    오시는 길
                  </h3>
                  <div className="space-y-2">
                    {store.directions.map((direction, index) => (
                      <p key={index} className="text-xs text-foreground/70">
                        {direction}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 매장 상품 섹션 */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-foreground">
                이 매장에서 판매하는 상품
              </h3>

              {loadingProducts ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-[200px] h-[280px] flex-shrink-0 rounded-lg"
                    />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {products.map((product) => (
                    <StoreProductCard key={product.post_id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">
                    이 매장에서 판매하는 상품이 없습니다.
                  </p>
                  <p className="text-xs mt-1">
                    곧 새로운 상품이 등록될 예정입니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
