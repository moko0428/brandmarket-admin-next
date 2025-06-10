'use client';

import { useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { cn } from '@/lib/utils';

interface InputPairProps {
  id: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function InputPair({
  id,
  label,
  value,
  onChange,
  className,
  placeholder,
}: InputPairProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={cn(
          'absolute transition-all duration-200 z-10',
          isFocused || value
            ? 'left-2 -top-2 text-xs text-foreground bg-white px-1'
            : 'left-3 top-1/2 -translate-y-1/2 text-gray-500'
        )}
      >
        {label}
      </label>

      <Input
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn('pl-3 pt-2', className)}
      />
    </div>
  );
}
