'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/common/components/ui/carousel';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PostCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export function PostCarousel({ images, title, className }: PostCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div
        className={cn(
          'relative aspect-square overflow-hidden rounded-lg',
          className
        )}
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* 버튼은 제거하고 인디케이터만 추가 */}
      </Carousel>

      {/* 인디케이터 점들 */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                current === index
                  ? 'bg-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
