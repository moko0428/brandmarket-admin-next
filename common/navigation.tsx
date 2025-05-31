import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const menus = [
  {
    name: 'Inventory',
    href: '/product',
  },
  {
    name: 'Location',
    href: '/location',
  },
];

export default function Navigation() {
  return (
    <NavigationMenu>
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
