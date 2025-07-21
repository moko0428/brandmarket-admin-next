'use client';

import { Button } from '@/common/components/ui/button';
import { Separator } from '@/common/components/ui/separator';

export default function PostSection() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0">
        <h2>내 포스트</h2>
        <Separator />
      </div>

      <div className="flex-1 pb-30">
        <div className="grid grid-cols-3 p-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <Button
              variant="ghost"
              key={index}
              className="border border-black w-full h-50 rounded-none"
            >
              <div className="w-full h-full" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
