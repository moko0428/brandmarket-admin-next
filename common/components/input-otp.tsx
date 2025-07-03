import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/common/components/ui/input-otp';
import { Label } from '@/common/components/ui/label';

export function InputOTPPair({
  label,
  id,
  name,
  className,
  onChange,
}: {
  label?: string;
  id: string;
  name: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <InputOTP
      maxLength={6}
      id={id}
      name={name}
      className={className}
      onChange={onChange}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
