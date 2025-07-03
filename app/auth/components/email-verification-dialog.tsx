'use client';

import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { resendEmailAction } from '../signup/action';

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  message?: string;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  email,
  message = '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
}: EmailVerificationDialogProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendState, setResendState] = useState<{
    error: string;
    success: boolean;
  }>({ error: '', success: false });

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setResendState({ error: '', success: false });

    try {
      const formData = new FormData();
      formData.append('email', email);
      const result = await resendEmailAction({ error: '' }, formData);
      setResendState(result as { error: string; success: boolean });
    } catch {
      setResendState({
        error: '이메일 재전송 중 오류가 발생했습니다.',
        success: false,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            이메일 확인이 필요합니다
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              계정을 활성화하기 위해 이메일을 확인해주세요
            </p>
          </div>

          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {resendState.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>이메일을 다시 보냈습니다.</AlertDescription>
            </Alert>
          )}

          {resendState.error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{resendState.error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <strong>{email}</strong>로 확인 이메일을 보냈습니다.
            </p>
            <p className="text-xs text-gray-500">
              이메일의 링크를 클릭하여 계정을 활성화해주세요.
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              이메일이 보이지 않는다면 스팸 폴더를 확인해주세요.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                '이메일 다시 보내기'
              )}
            </Button>

            <Button onClick={onClose} className="w-full">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
