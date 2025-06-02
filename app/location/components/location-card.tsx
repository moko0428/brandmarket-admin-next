import Image from 'next/image';

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
    <div className="flex flex-col gap-2 border-2 border-black/50 mb-2">
      <div key={id}>
        {image ? (
          <Image
            src={image}
            alt={name}
            className="bg-gray-200 w-full h-40 object-cover"
            width={100}
            height={100}
          />
        ) : (
          <div className="bg-gray-200 w-full h-40" />
        )}
        <div className="p-2 space-y-2">
          <div className="flex flex-col">
            <span className="font-bold">{name}</span>
            <span className="text-sm text-foreground/50">{address}</span>
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? (
              <span className="text-sm text-green-500">영업중</span>
            ) : (
              <span className="text-sm text-red-500">영업 종료</span>
            )}
            <span className="text-sm">{openTime}</span>
            <span className="text-sm">{distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
