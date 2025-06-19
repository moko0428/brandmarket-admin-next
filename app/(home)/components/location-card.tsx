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
    <div className="grid grid-cols-5 gap-2 border-b border-black/30 last:border-b-0">
      <div key={id} className="col-span-2">
        {image ? (
          <ImagePair image={image} name={name} />
        ) : (
          <Skeleton className="w-full h-70" />
        )}
      </div>
      <div className="p-2 space-y-2 col-span-3">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-foreground">{name}</span>
          <span className="text-xs text-foreground/50">{address}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            {isOpen ? (
              <span className="text-xs text-green-500">영업중</span>
            ) : (
              <span className="text-xs text-red-500">영업 종료</span>
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs text-foreground/70">{openTime}</span>
          </div>
          <div className="shrink-0">
            <span className="text-xs text-foreground/70">
              ({distance ? distance : '0.0km'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
