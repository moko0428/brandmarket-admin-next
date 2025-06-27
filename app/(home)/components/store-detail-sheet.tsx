import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/common/components/ui/sheet';
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Skeleton } from '@/common/components/ui/skeleton';
import ImagePair from './imagePair';
import { toast } from 'sonner';
import { Store } from '../atoms/drawer-atom';

interface StoreDetailSheetProps {
  store: Store | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function StoreDetailSheet({
  store,
  onClose,
  isOpen,
}: StoreDetailSheetProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleCopy = (text: string) => {
    toast.success('복사되었습니다.');
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const openAdressMenu = () => {
    setOpen((prev) => !prev);
  };

  // 매장이 없으면 렌더링하지 않음
  if (!store) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full h-[100dvh] p-0">
        <SheetHeader className="px-4 py-6 border-b sticky top-0 bg-white">
          <SheetTitle>{store.branch}</SheetTitle>
          <SheetDescription>{store.address}</SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6 overflow-y-auto h-[calc(100dvh-80px)]">
          <div className="rounded-lg overflow-hidden mb-6">
            {store.store_image ? (
              <ImagePair image={store.store_image} name={store.branch} />
            ) : (
              <Skeleton className="w-full h-70" />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm text-foreground">
                영업 시간
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
