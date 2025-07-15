'use client';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export default function Navigation() {
  return (
    <nav className="flex px-5 h-16 items-center justify-between fixed top-0 left-0 right-0 z-50 bg-white max-w-screen-md mx-auto border-b-2">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/" className="font-bold text-lg md:text-xl">
            BrandMarket
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6 mx-4" />
      </div>
    </nav>
  );
}
