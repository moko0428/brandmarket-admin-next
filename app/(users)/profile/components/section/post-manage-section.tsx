import { Button } from '@/common/components/ui/button';
import { StickyNoteIcon } from 'lucide-react';
import Link from 'next/link';

export default function PostManageSection() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant={'link'} className="flex flex-col">
        <Link href="/product" className="flex flex-col items-center gap-2">
          <StickyNoteIcon className="size-12" />
          포스트
        </Link>
      </Button>
    </div>
  );
}
