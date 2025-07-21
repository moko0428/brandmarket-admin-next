import Image from 'next/image';

export default function ImagePair({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="w-full p-2">
      <Image
        src={image}
        alt={name}
        width={800}
        height={600}
        quality={80}
        className="w-full object-cover rounded-lg"
      />
    </div>
  );
}
