'use client';

import { useActionState, useTransition } from 'react';
import { useState, useEffect } from 'react';
import {
  sendOTPAction,
  verifyOTPAction,
  resendEmailAction,
  signupAction,
} from './action';
import { Button } from '@/common/components/ui/button';
import Link from 'next/link';
import { Hero } from '@/common/components/hero';
import { InputPair } from '@/common/components/input-pair';
import { InputOTPPair } from '@/common/components/input-otp';
import { Mail, CheckCircle } from 'lucide-react';
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
import { toast } from 'sonner';

export default function SignupPage() {
  const [state, formAction] = useActionState(sendOTPAction, { error: '' });
  const [otpState, otpFormAction] = useActionState(verifyOTPAction, {
    error: '',
  });
  const [, resendFormAction] = useActionState(resendEmailAction, {
    error: '',
  });
  const [signupState, signupFormAction] = useActionState(signupAction, {
    error: '',
  });

  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [otp, setOtp] = useState('');
  const [isPending, startTransition] = useTransition();

  // OTP 전송 성공 시 다이얼로그 표시
  useEffect(() => {
    if (state?.success) {
      setShowOTPDialog(true);
      toast.success('인증 코드가 전송되었습니다.', {
        description: '이메일을 확인해주세요.',
        icon: <Mail className="h-4 w-4" />,
      });
    }
  }, [state]);

  // OTP 인증 성공 시 처리
  useEffect(() => {
    if (otpState?.success) {
      setShowOTPDialog(false);
      setIsEmailVerified(true);

      // Sonner 토스트 메시지 표시
      toast.success('이메일 인증 완료', {
        description: '이메일 인증이 완료되었습니다. 회원가입을 진행해주세요.',
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 4000,
      });
    }
  }, [otpState]);

  // 회원가입 성공 시 처리
  useEffect(() => {
    if (signupState?.success) {
      toast.success('회원가입 완료', {
        description: signupState.message || '회원가입이 완료되었습니다!',
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 3000,
      });

      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href =
          '/auth/login?message=회원가입이 완료되었습니다. 로그인해주세요.';
      }, 3000);
    }
  }, [signupState]);

  // 에러 처리
  useEffect(() => {
    if (state?.error) {
      toast.error('인증 코드 전송 실패', {
        description: state.error,
      });
    }
  }, [state?.error]);

  useEffect(() => {
    if (otpState?.error) {
      toast.error('인증 실패', {
        description: otpState.error,
      });
    }
  }, [otpState?.error]);

  useEffect(() => {
    if (signupState?.error) {
      toast.error('회원가입 실패', {
        description: signupState.error,
      });
    }
  }, [signupState?.error]);

  // 폼 제출 핸들러 (새로고침 방지)
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 방지

    const formDataObj = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formDataObj);
    });
  };

  const handleVerifyOTP = () => {
    const otpFormData = new FormData();
    otpFormData.append('email', formData.email);
    otpFormData.append('otp', otp);

    startTransition(() => {
      otpFormAction(otpFormData);
    });
  };

  const handleSignup = () => {
    const signupFormData = new FormData();
    signupFormData.append('name', formData.name);
    signupFormData.append('email', formData.email);
    signupFormData.append('password', formData.password);
    signupFormData.append('password_confirm', formData.password_confirm);

    startTransition(() => {
      signupFormAction(signupFormData);
    });
  };

  const handleResendOTP = () => {
    const resendFormData = new FormData();
    resendFormData.append('email', formData.email);

    startTransition(() => {
      resendFormAction(resendFormData);
    });
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
            <form onSubmit={handleFormSubmit} className="space-y-4">
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

              {isEmailVerified ? (
                <Button
                  type="button"
                  className="w-full"
                  disabled={isPending}
                  onClick={handleSignup}
                >
                  {isPending ? '회원가입 중...' : '회원가입하기'}
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? '전송 중...' : '이메일 인증하기'}
                </Button>
              )}
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                이미 계정이 있으신가요? 로그인
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
                onChange={(value) => setOtp(value)}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleVerifyOTP}
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? '인증 중...' : '인증하기'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isPending}
                >
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
