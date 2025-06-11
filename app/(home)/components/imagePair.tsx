import Image from 'next/image';

export default function ImagePair({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="bg-black w-full h-70">
      <Image
        src={image}
        alt={name}
        width={640}
        height={360}
        quality={75}
        className="w-full h-70 object-contain"
      />
    </div>
  );
}
