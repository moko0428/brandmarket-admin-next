'use client';

import { Card, CardContent } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface StoreProduct {
  post_id: string;
  title: string;
  images: string[];
  product_name: string;
  price: number;
  size: string;
  color: string;
  created_at: string;
}

interface StoreProductCardProps {
  product: StoreProduct;
}

export function StoreProductCard({ product }: StoreProductCardProps) {
  const mainImage = product.images[0];

  return (
    <Link href={`/posts/${product.post_id}`}>
      <Card className="w-[200px] flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.product_name}
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
          )}

          {/* 이미지 개수 표시 */}
          {product.images.length > 1 && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 text-xs"
            >
              +{product.images.length - 1}
            </Badge>
          )}
        </div>

        <CardContent className="p-3">
          <h4 className="font-semibold text-sm mb-1 line-clamp-1">
            {product.product_name}
          </h4>

          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-primary">
              {product.price.toLocaleString()}원
            </span>
          </div>

          <div className="flex gap-2 text-xs text-gray-600">
            <span>{product.size}</span>
            <span>•</span>
            <span>{product.color}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
