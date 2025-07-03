'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/common/components/ui/input';
import { cn } from '@/lib/utils';

interface InputPairProps {
  id: string;
  label?: string;
  value?: string;
  name?: string;
  type?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function InputPair({
  id,
  label,
  value,
  name,
  onChange,
  type,
  className,
  placeholder,
}: InputPairProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // value가 변경될 때마다 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(Boolean(value && value.trim().length > 0));
  }, [value]);

  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={cn(
          'absolute transition-all duration-200 z-10',
          shouldFloat
            ? 'left-2 -top-2 text-xs text-foreground bg-white px-1'
            : 'left-3 top-1/2 -translate-y-1/2 text-gray-500'
        )}
      >
        {label}
      </label>

      <Input
        id={id}
        value={value}
        name={name}
        type={type}
        onChange={(e) => {
          const newValue = e.target.value;
          setHasValue(Boolean(newValue && newValue.trim().length > 0));
          onChange?.(newValue);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn('pl-3 pt-2', className)}
      />
    </div>
  );
}
