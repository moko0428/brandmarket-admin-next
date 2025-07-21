import { Button } from '@/common/components/ui/button';
import { UsersIcon } from 'lucide-react';

export default function MemberSection({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={'link'}
        className="flex flex-col"
        onClick={() => setOpen(true)}
      >
        <UsersIcon className="size-12" />
        회원
      </Button>
    </div>
  );
}
