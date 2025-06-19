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
import { detailStoreList } from '@/data/store';
import { Skeleton } from '@/common/components/ui/skeleton';
import ImagePair from './imagePair';
import { toast } from 'sonner';

export default function StoreDetailSheet({
  onClose,
  isOpen,
  id,
}: {
  id: number;
  onClose: () => void;
  isOpen: boolean;
}) {
  const detailStore = detailStoreList.find((store) => store.id === id);

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
  return (
    <div className="hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full h-[100dvh] p-0">
          <SheetHeader className="px-4 py-6 border-b sticky top-0 bg-white">
            <SheetTitle>{detailStore?.name}</SheetTitle>
            <SheetDescription>{detailStore?.address}</SheetDescription>
          </SheetHeader>

          <div className="px-4 py-6 overflow-y-auto h-[calc(100dvh-80px)]">
            <div className="rounded-lg overflow-hidden mb-6">
              {detailStore?.image ? (
                <ImagePair
                  image={detailStore?.image || ''}
                  name={detailStore?.name || ''}
                />
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
                  {detailStore?.openTime}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">
                  주소
                </h3>
                <DropdownMenu open={open} onOpenChange={openAdressMenu}>
                  <DropdownMenuTrigger className="flex items-center">
                    <p className="flex items-center">{detailStore?.address}</p>
                    {open ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {detailStore?.copy.map((copy) => (
                      <DropdownMenuItem
                        key={copy.copy_road}
                        onClick={() => handleCopy(copy.copy_road)}
                        className="flex items-center justify-between gap-2 cursor-pointer hover:bg-transparent"
                      >
                        <p className="text-xs text-foreground/70">
                          {copy.copy_road}
                        </p>
                        {copied === copy.copy_road ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={() =>
                        handleCopy(detailStore?.copy[0].copy_street || '')
                      }
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <p className="text-xs text-foreground/70">
                        {detailStore?.copy[0].copy_street}
                      </p>
                      {copied === detailStore?.copy[0].copy_street ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">
                  오시는 길
                </h3>
                <div className="space-y-2">
                  {detailStore?.place.map((place) => (
                    <p key={place} className="text-xs text-foreground/70">
                      {place}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
