import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { AlignJustify } from 'lucide-react';

export const LocationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <AlignJustify />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {/* 주요 메뉴 항목들 */}
        <DropdownMenuItem className="py-3">홈</DropdownMenuItem>
        <DropdownMenuItem className="py-3">매장 안내</DropdownMenuItem>
        <DropdownMenuItem className="py-3">이벤트</DropdownMenuItem>
        <DropdownMenuItem className="py-3">공지사항</DropdownMenuItem>

        {/* 구분선 */}
        <DropdownMenuSeparator />

        {/* 부가 기능 */}
        <DropdownMenuItem className="py-3">앱 설정</DropdownMenuItem>
        <DropdownMenuItem className="py-3">고객센터</DropdownMenuItem>

        {/* 앱 정보 */}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-sm text-muted-foreground">
          버전 1.0.0
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
