import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Hero({ title, subtitle, className }: HeroProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center bg-gradient-to-t from-background to-primary/10 py-6',
        className
      )}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-lg font-light text-foreground">{subtitle}</p>
    </div>
  );
}
