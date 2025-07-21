import { Button } from '@/common/components/ui/button';
import { MenuIcon } from 'lucide-react';

export default function ListOpenButton({
  setDrawerOpen,
  drawerOpen,
}: {
  setDrawerOpen: (open: boolean) => void;
  drawerOpen: boolean;
}) {
  return (
    <Button
      onClick={() => setDrawerOpen(true)}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-white shadow-xl border-2 border-gray-200 hover:bg-gray-50 rounded-full h-10 px-4 flex items-center gap-2 text-foreground
             data-[open=true]:hidden"
      data-open={drawerOpen}
    >
      <MenuIcon className="w-4 h-4" />
      <span className="text-sm">매장 목록 보기</span>
    </Button>
  );
}
