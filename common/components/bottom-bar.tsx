'use client';

import { HomeIcon, MapIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { browserClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

const menus = [
  { id: 1, name: <HomeIcon />, href: '/list' },
  { id: 2, name: <MapIcon />, href: '/' },
  { id: 3, name: <UserIcon />, href: '/profile' },
];

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = browserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleProfileClick = (e: React.MouseEvent, href: string) => {
    if (href === '/profile') {
      e.preventDefault();

      if (isLoggedIn === null) {
        // 로딩 중이면 아무것도 하지 않음
        return;
      }

      if (isLoggedIn) {
        // 로그인된 경우 프로필 페이지로 이동
        router.push('/profile');
      } else {
        // 비로그인된 경우 로그인 페이지로 이동
        router.push('/auth/login');
      }
    }
  };

  // 현재 페이지가 활성화된 메뉴인지 확인하는 함수
  const isActiveMenu = (href: string) => {
    if (!mounted) return false; // 마운트 전에는 false 반환

    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/list') {
      return pathname === '/list';
    }
    if (href === '/profile') {
      return pathname === '/profile';
    }
    return false;
  };

  // 마운트 전에는 기본 스타일로 렌더링
  if (!mounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-[50px] z-50 bg-white w-full border-t block md:hidden">
        <div className="w-full h-full flex justify-between items-center px-5">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.href}
              className="flex-1 h-full flex items-center justify-center text-sm font-medium text-gray-600 transition-colors"
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[50px] z-50 bg-white w-full border-t block md:hidden">
      <div className="w-full h-full flex justify-between items-center px-5">
        {menus.map((menu) => {
          const isActive = isActiveMenu(menu.href);

          return (
            <Link
              key={menu.id}
              href={menu.href}
              onClick={(e) => handleProfileClick(e, menu.href)}
              className={`flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors rounded-lg ${
                isActive
                  ? 'bg-gray-200 text-gray-900' // 활성화된 메뉴: 어두운 배경
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' // 비활성화된 메뉴
              }`}
            >
              {menu.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
