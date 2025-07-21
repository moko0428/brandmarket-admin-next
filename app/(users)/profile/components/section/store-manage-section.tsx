import { Button } from '@/common/components/ui/button';
import { StoreIcon } from 'lucide-react';

export default function StoreManageSection({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={() => setOpen(true)}
        variant={'link'}
        className="flex flex-col"
      >
        <StoreIcon className="size-12" />
        매장
      </Button>
    </div>
  );
}
