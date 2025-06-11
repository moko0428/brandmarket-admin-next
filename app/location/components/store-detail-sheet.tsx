import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/common/components/ui/sheet';
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';

export const detailStoreList = [
  {
    id: 1,
    name: '브랜드마켓 홍대점',
    address: '서울 마포구 홍익로6길 27 지하1층 (동교동)',
    openTime: '10:30 - 22:00',
    image: '',
    place: ['2호선 홍대입구역 9번 출구로 나와서 218m 이동 (4분거리)'],
    copy: [
      {
        copy_road: '서울 마포구 홍익로6길 27 지하1층',
        copy_street: '동교동 162-10',
      },
    ],
  },
  {
    id: 2,
    name: '브랜드마켓 성수점',
    address: '서울 성동구 연무장길 5 (성수동2가)',
    openTime: '10:30 - 22:00',
    image: '',
    place: [
      '수인분당선 서울숲역 1번 출구로 나와서 755m 이동 (12분거리)',
      '2호선 뚝섬역 5번 출구로 나와서 533m 이동 (9분거리)',
      '2호선 성수역 4번 출구로 나와서 673m 이동 (11분거리)',
    ],
    copy: [
      {
        copy_road: '서울 성동구 연무장길 5',
        copy_street: '성수동2가 301-64',
      },
    ],
  },
  {
    id: 3,
    name: '브랜드마켓 강남점',
    address: '서울 강남구 강남대로 430 (역삼동)',
    openTime: '10:30 - 22:00',
    image: '',
    place: [
      '2호선 강남역 11번 출구로 나와서 417m 이동 (7분거리)',
      '신분당선 신논현역 6번 출구로 나와서 381m 이동 (6분거리)',
    ],
    copy: [
      {
        copy_road: '서울 강남구 강남대로 430',
        copy_street: '역삼동 815-3',
      },
    ],
  },
  {
    id: 4,
    name: '브랜드마켓 홍대 상상마당점',
    address: '서울 마포구 어울림마당로 75 (서교동)',
    openTime: '10:30 - 22:00',
    image: '',
    place: [
      '2호선 합정역 3번 출구로 나와서 790m 이동 (13분거리)',
      '6호선 상수역 1번 출구로 나와서 658m 이동 (11분거리)',
    ],
    copy: [
      {
        copy_road: '서울 마포구 어울림마당로 75',
        copy_street: '서교동 366-19',
      },
    ],
  },
];

export default function StoreDetailSheet({
  onClose,
  isOpen,
  id,
}: {
  id: number;
  onClose: () => void;
  isOpen: boolean;
}) {
  const detailStore = detailStoreList.find((store) => store.id === id);

  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };
  const openAdressMenu = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="right" className="w-full h-[100dvh] p-0">
          <SheetHeader className="px-4 py-6 border-b sticky top-0 bg-white">
            <SheetTitle>{detailStore?.name}</SheetTitle>
            <SheetDescription>{detailStore?.address}</SheetDescription>
          </SheetHeader>

          <div className="px-4 py-6 overflow-y-auto h-[calc(100dvh-80px)]">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6"></div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">영업 시간</h3>
                <p>{detailStore?.openTime}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">주소</h3>
                <DropdownMenu open={open} onOpenChange={openAdressMenu}>
                  <DropdownMenuTrigger className="flex items-center">
                    <Button variant="ghost">{detailStore?.address}</Button>
                    {open ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {detailStore?.copy.map((copy) => (
                      <DropdownMenuItem
                        key={copy.copy_road}
                        onClick={() => handleCopy(copy.copy_road)}
                        className="flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <p>{copy.copy_road}</p>
                        {copied === copy.copy_road ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={() =>
                        handleCopy(detailStore?.copy[0].copy_street || '')
                      }
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <p>{detailStore?.copy[0].copy_street}</p>
                      {copied === detailStore?.copy[0].copy_street ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="font-semibold mb-2">오시는 길</h3>
                <div className="space-y-2">
                  {detailStore?.place.map((place) => (
                    <p key={place} className="text-sm">
                      {place}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
