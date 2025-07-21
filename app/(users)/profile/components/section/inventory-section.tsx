import { Button } from '@/common/components/ui/button';
import { PackageIcon } from 'lucide-react';
import Link from 'next/link';

export default function InventorySection() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant={'link'} className="flex flex-col">
        <Link href="/product" className="flex flex-col items-center gap-2">
          <PackageIcon className="size-12" />
          재고
        </Link>
      </Button>
    </div>
  );
}
