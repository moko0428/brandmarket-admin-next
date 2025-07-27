import { Button } from '@/common/components/ui/button';
import { ChevronRight, UsersIcon } from 'lucide-react';

export default function MemberSection({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b py-2">
      <div className="flex items-center gap-2">
        <UsersIcon className="size-8" />
        회원
      </div>
      <Button variant={'link'} className="flex" onClick={() => setOpen(true)}>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Button>
    </div>
  );
}
