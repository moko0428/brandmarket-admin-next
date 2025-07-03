'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/common/components/ui/sheet';
import { MenuIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { browserClient } from '@/lib/supabase/client';

interface Profile {
  profile_id: string;
  name: string;
  email: string;
  role: string;
  location_name: string;
}

export default function MobileSidebarSheet() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = browserClient();
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('profile_id', user.user.id)
          .single();
        setUserProfile(profile as unknown as Profile);
      }
    };

    loadProfile();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MenuIcon className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>
            {userProfile?.role === 'admin'
              ? 'BrandMarket 관리자'
              : userProfile?.name || '사용자'}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          <Link
            href="/profile"
            className="flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingBagIcon className="mr-3 h-5 w-5" />
            프로필
          </Link>
          <Link
            href="/store"
            className="flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingBagIcon className="mr-3 h-5 w-5" />
            매장 정보 관리
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
