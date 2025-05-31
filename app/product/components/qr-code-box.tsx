'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface QrCodeBoxProps {
  value: string;
  size?: number;
  label?: string;
}

export default function QrCodeBox({
  value,
  size = 256,
  label,
}: QrCodeBoxProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="font-semibold text-lg">{label}</p>}
      <QRCodeCanvas value={value} size={size} />
      <p className="text-sm text-gray-500 break-all">{value}</p>
    </div>
  );
}
