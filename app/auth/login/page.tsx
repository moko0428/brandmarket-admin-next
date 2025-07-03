'use client';

import { Hero } from '@/common/components/hero';
import { InputPair } from '@/common/components/input-pair';
import { Button } from '@/common/components/ui/button';
import { useActionState, useEffect } from 'react';
import { loginAction } from './action';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: '' });

  useEffect(() => {
    if (state?.error) {
      toast.error('로그인 실패', {
        description: state.error,
      });
    }
  }, [state?.error]);

  return (
    <div className="flex flex-col justify-center h-full">
      <Hero title="브랜드마켓 로그인" subtitle="안녕하세요. 어서오세요! :)" />
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              로그인 후 브랜드마켓을 이용해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="flex flex-col gap-2 w-full">
                <InputPair
                  label="이메일"
                  id="email"
                  name="email"
                  className="w-full"
                />
                {state?.error?.includes('이메일') && (
                  <span className="text-sm text-red-500">
                    이메일을 입력해주세요.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <InputPair
                  label="비밀번호"
                  id="password"
                  name="password"
                  type="password"
                  className="w-full"
                />
                {state?.error?.includes('비밀번호') && (
                  <span className="text-sm text-red-500">
                    비밀번호를 입력해주세요.
                  </span>
                )}
              </div>

              <Button className="w-full" type="submit">
                로그인
              </Button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <Link
                  href="/auth/signup"
                  className="text-sm text-muted-foreground"
                >
                  <span className="underline text-blue-500">회원가입하기</span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
