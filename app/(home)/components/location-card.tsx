import { Skeleton } from '@/common/components/ui/skeleton';
import ImagePair from './imagePair';

export default function LocationCard({
  id,
  name,
  address,
  image,
  isOpen,
  openTime,
  distance,
}: {
  id: number;
  name: string;
  address: string;
  image?: string;
  isOpen: boolean;
  openTime: string;
  distance: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-black/30 last:border-b-0">
      <div key={id}>
        {image ? (
          <ImagePair image={image} name={name} />
        ) : (
          <Skeleton className="w-full h-70" />
        )}
      </div>
      <div className="p-2 space-y-2 ">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-foreground">{name}</span>
          <span className="text-xs text-foreground/50">{address}</span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <span className="text-xs text-green-500">영업중</span>
          ) : (
            <span className="text-xs text-red-500">영업 종료</span>
          )}
          <span className="text-xs text-foreground/70">{openTime}</span>
          <span className="text-xs text-foreground/70">({distance})</span>
        </div>
      </div>
    </div>
  );
}
