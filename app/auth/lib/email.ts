import nodemailer from 'nodemailer';

// 이메일 전송기 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail 앱 비밀번호
  },
});

// 인증 코드 생성 함수
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 이메일 전송 함수
export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '브랜드마켓 이메일 인증',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">브랜드마켓 가입을 축하합니다!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            안녕하세요, <strong>${name}</strong>님!<br>
            브랜드마켓 회원가입을 위한 이메일 인증 코드를 보내드립니다.
          </p>
          
          <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 2px solid #e9ecef; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">인증 코드</h3>
            <div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 20px 0;">
            ⏰ 이 인증 코드는 <strong>5분간</strong> 유효합니다.<br>
            �� 본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            브랜드마켓 팀<br>
            <a href="mailto:support@brandmarket.com" style="color: #007bff; text-decoration: none;">support@brandmarket.com</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    console.error('이메일 전송 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}
