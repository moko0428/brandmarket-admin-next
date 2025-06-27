'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
export default function SelectPair({
  name,
  required,
  placeholder,
  options,
  defaultValue,
}: {
  name: string;
  required: boolean;
  label: string;
  description: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Select
        open={open}
        onOpenChange={setOpen}
        name={name}
        required={required}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
