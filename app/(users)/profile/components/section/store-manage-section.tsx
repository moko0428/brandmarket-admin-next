import { Button } from '@/common/components/ui/button';
import { ChevronRight, StoreIcon } from 'lucide-react';

export default function StoreManageSection({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b pb-2">
      <div className="flex items-center gap-2">
        <StoreIcon className="size-8" />
        매장 관리하기
      </div>
      <Button onClick={() => setOpen(true)} variant={'link'}>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Button>
    </div>
  );
}
