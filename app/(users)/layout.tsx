import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/common/components/ui/sidebar';
import { serverClient } from '@/lib/supabase/server';
import {
  // ChartLineIcon,
  HomeIcon,
  // PackageIcon,
  ShoppingBagIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import MobileSidebarSheet from './profile/components/mobile-sidebar-sheet';

export const metadata: Metadata = {
  title: 'Brand Market | 관리자 페이지',
  description: 'Brand Market',
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await serverClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('profile_id', user?.user?.id || '');

  const userProfile = Array.isArray(profile) ? profile[0] : profile;

  return (
    <SidebarProvider className="max-h-[calc(100vh-7rem)] overflow-hidden h-[calc(100vh-7rem)] min-h-full">
      {/* 모바일 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center px-4">
        {userProfile?.role === 'admin' && <MobileSidebarSheet />}
        <div className="ml-4 font-semibold">
          {userProfile?.role === 'admin'
            ? 'BrandMarket 관리자'
            : `@${userProfile?.location_name}` || '사용자'}
        </div>
      </div>

      {/* 데스크톱 사이드바 */}
      <Sidebar variant="floating" className="pt-16 md:pt-0">
        <SidebarHeader className="pointer-events-none hidden md:block">
          {userProfile?.role === 'admin'
            ? 'BrandMarket 관리자'
            : userProfile?.location_name || '사용자'}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">
                    <ShoppingBagIcon className="mr-2 h-4 w-4" />
                    프로필
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/store">
                    <ShoppingBagIcon className="mr-2 h-4 w-4" />
                    매장 정보 관리
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/product">
                    <PackageIcon className="mr-2 h-4 w-4" />
                    재고 관리
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/analytics">
                    <ChartLineIcon className="mr-2 h-4 w-4" />
                    추이 분석
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    홈으로 가기
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* 메인 콘텐츠 */}
      <div className="py-0 md:py-4 px-0 h-screen w-full md:pt-0 pt-16">
        {children}
      </div>
    </SidebarProvider>
  );
}
