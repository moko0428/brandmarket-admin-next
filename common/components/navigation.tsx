'use client';
import Link from 'next/link';
import { useState } from 'react';
import { NavigationMenu } from './ui/navigation-menu';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useLogout } from '@/app/auth/hooks/use-logout';
import { LogoutDialog } from '@/app/auth/components/logout-dialog';

// const menus = [
//   {
//     name: 'Home',
//     href: '/',
//   },
// ];

export default function Navigation({
  isLoggedIn,
  avatar,
  name,
  storename,
  role,
}: {
  isLoggedIn?: boolean;
  avatar?: string;
  name?: string;
  storename?: string;
  role?: string;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDialogOpen, openLogoutDialog, closeLogoutDialog, handleLogout } =
    useLogout();

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    openLogoutDialog();
  };

  return (
    <nav className="flex px-5 h-[40px] items-center justify-between shadow-md md:h-16">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/" className="font-bold text-lg md:text-xl">
            BrandMarket
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu className="hidden md:block">
          {/* <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.name}>
                <NavigationMenuTrigger>
                  <Link
                    href={menu.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'opacity-85 hover:text-opacity-100'
                    )}
                  >
                    {menu.name}
                  </Link>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList> */}
        </NavigationMenu>
      </div>

      {isLoggedIn ? (
        <div className="hidden md:block">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar>
                {avatar ? (
                  <AvatarImage src={avatar} />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <span className="font-medium">{storename}</span>
                <span className="text-xs text-muted-foreground">
                  {name}
                  <br />
                  {role}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/profile" className="flex items-center gap-2">
                      <LayoutDashboardIcon className="w-4 h-4" />
                      대시보드
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogoutClick}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    로그아웃
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <LogoutDialog
            isOpen={isDialogOpen}
            onClose={closeLogoutDialog}
            onConfirm={handleLogout}
          />
        </div>
      ) : (
        <div className="hidden md:block">
          <Button className="w-full justify-start" asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              로그인
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
