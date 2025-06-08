import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/common/components/ui/sheet';

type Store = {
  name: string;
  address: string;
  openTime: string;
  image: string;
};

export default function StoreDetailSheet({
  onClose,
  isOpen,
  store,
}: {
  store: Store;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <div className="hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="right" className="w-full h-[100dvh] p-0">
          <SheetHeader className="px-4 py-6 border-b sticky top-0 bg-white">
            <SheetTitle>{store?.name}</SheetTitle>
            <SheetDescription>{store?.address}</SheetDescription>
          </SheetHeader>

          <div className="px-4 py-6 overflow-y-auto h-[calc(100dvh-80px)]">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6"></div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">영업 시간</h3>
                <p>{store?.openTime}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">주소</h3>
                <p>{store?.address}</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
