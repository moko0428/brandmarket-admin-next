import { z } from 'zod';

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        '비밀번호는 영문자와 숫자를 포함해야 합니다.'
      ),
    password_confirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    location_name: z
      .string()
      .min(1, '이름을 입력해주세요.')
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(50, '이름은 최대 50자까지 입력 가능합니다.')
      .trim(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_confirm'],
  });

// 이메일 확인 스키마
export const emailCheckSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
});

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 프로필 업데이트 스키마
export const profileUpdateSchema = z.object({
  location_name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 최대 50자까지 입력 가능합니다.')
    .trim(),
  avatar: z.string().url().optional().or(z.literal('')),
});

// 타입 추출
export type SignupFormData = z.infer<typeof signupSchema>;
export type EmailCheckData = z.infer<typeof emailCheckSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
