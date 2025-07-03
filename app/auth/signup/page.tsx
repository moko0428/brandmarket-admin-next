'use client';

import { useActionState } from 'react';
import { useState, useEffect } from 'react';
import { sendOTPAction, verifyOTPAction, resendEmailAction } from './action';
import { Button } from '@/common/components/ui/button';
import Link from 'next/link';
import { Hero } from '@/common/components/hero';
import { InputPair } from '@/common/components/input-pair';
import { InputOTPPair } from '@/common/components/input-otp';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';

export default function SignupPage() {
  const [state, formAction] = useActionState(sendOTPAction, { error: '' });
  const [otpState, otpFormAction] = useActionState(verifyOTPAction, {
    error: '',
  });
  const [, resendFormAction] = useActionState(resendEmailAction, {
    error: '',
  });

  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [otp, setOtp] = useState('');

  // OTP 전송 성공 시 다이얼로그 표시
  useEffect(() => {
    if (state?.success) {
      setShowOTPDialog(true);
    }
  }, [state]);

  // OTP 인증 성공 시 처리
  useEffect(() => {
    if (otpState?.success) {
      setShowOTPDialog(false);
      // 성공 메시지 표시 또는 리다이렉트
    }
  }, [otpState]);

  const handleSendOTP = async (formData: FormData) => {
    await formAction(formData);
  };

  const handleVerifyOTP = async () => {
    const otpFormData = new FormData();
    otpFormData.append('email', formData.email);
    otpFormData.append('otp', otp);
    otpFormData.append('name', formData.name);
    otpFormData.append('password', formData.password);

    await otpFormAction(otpFormData);
  };

  const handleResendOTP = async () => {
    const resendFormData = new FormData();
    resendFormData.append('email', formData.email);

    await resendFormAction(resendFormData);
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <Hero title="브랜드마켓 회원가입" subtitle="안녕하세요. 어서오세요! :)" />
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>
              이메일 인증을 통해 안전하게 가입하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSendOTP} className="space-y-4">
              <InputPair
                id="name"
                label="이름"
                name="name"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
              />
              <InputPair
                id="email"
                label="이메일"
                name="email"
                type="email"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
              />
              <InputPair
                id="password"
                label="비밀번호"
                name="password"
                type="password"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, password: value }))
                }
              />
              <InputPair
                id="password_confirm"
                label="비밀번호 확인"
                name="password_confirm"
                type="password"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, password_confirm: value }))
                }
              />

              {state?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                이메일 인증하기
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                이미 계정이 있으신가요?{' '}
                <span className="underline text-blue-500">로그인</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* OTP 인증 다이얼로그 */}
        <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>이메일 인증</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {formData.email}로 전송된 인증 코드를 입력해주세요.
              </p>

              <InputOTPPair
                id="otp"
                label="인증 코드"
                name="otp"
                className="w-full"
                onChange={(value) => setOtp(value)}
              />

              {otpState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{otpState.error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleVerifyOTP} className="flex-1">
                  인증하기
                </Button>
                <Button variant="outline" onClick={handleResendOTP}>
                  재전송
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
