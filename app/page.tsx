import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href="/product">Product &rarr;</Link>
      <Link href="/location">Location &rarr;</Link>
    </div>
  );
}
