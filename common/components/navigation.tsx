import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';

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

export default function Navigation() {
  return (
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
  );
}
