import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';
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

const menus = [
  {
    name: 'Home',
    href: '/',
  },
  // {
  //   name: 'Inventory',
  //   href: '/product',
  // },
  {
    name: 'Location',
    href: '/location',
  },
  // {
  //   name: 'Profile',
  //   href: '/users',
  // },
];

export default function Navigation({
  isLoggedIn = false,
  avatar,
  name,
  storename,
  role,
}: {
  isLoggedIn: boolean;
  avatar: string;
  name: string;
  storename: string;
  role: string;
}) {
  return (
    <nav className="flex px-20 h-16 items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="font-bold tracking-tighter text-xl">
          BrandMarket
        </Link>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
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
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {isLoggedIn ? (
        <div>
          <DropdownMenu>
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
                    asChild
                  >
                    <Link href="/" className="flex items-center gap-2">
                      <LogOutIcon className="w-4 h-4" />
                      로그아웃
                    </Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <Button asChild>
            <Link href="/">Login</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
