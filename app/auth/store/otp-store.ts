interface OTPData {
  otp: string;
  expires: number;
  userData: {
    name: string;
    email: string;
    password: string;
  };
}

// 메모리 기반 OTP 저장소 (개발용)
// 프로덕션에서는 Redis나 데이터베이스 사용 권장
const otpStore = new Map<string, OTPData>();

export const OTPStore = {
  // OTP 저장
  set(email: string, otp: string, userData: OTPData['userData']): void {
    const expires = Date.now() + 5 * 60 * 1000; // 5분 유효
    otpStore.set(email, { otp, expires, userData });
  },

  // OTP 조회
  get(email: string): OTPData | null {
    const data = otpStore.get(email);
    if (!data) return null;

    // 만료 확인
    if (Date.now() > data.expires) {
      otpStore.delete(email);
      return null;
    }

    return data;
  },

  // OTP 삭제
  delete(email: string): void {
    otpStore.delete(email);
  },

  // 만료된 OTP 정리
  cleanup(): void {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
      if (now > data.expires) {
        otpStore.delete(email);
      }
    }
  },
};
