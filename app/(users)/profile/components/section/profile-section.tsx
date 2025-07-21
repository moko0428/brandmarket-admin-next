import { Button } from '@/common/components/ui/button';
import { ChevronRight, UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProfileSection({
  avatar,
  name,
  role,
  setOpen,
}: {
  avatar: string;
  name: string;
  role: string;
  setOpen: (open: boolean) => void;
}) {
  // avatar 값 정규화 - null, undefined, 빈 문자열 처리
  const normalizedAvatar =
    avatar &&
    avatar.trim() !== '' &&
    avatar !== 'null' &&
    avatar !== 'undefined' &&
    avatar.startsWith('http')
      ? avatar
      : null;

  console.log('ProfileSection 렌더링:', { avatar, normalizedAvatar });

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          {normalizedAvatar ? (
            <Image
              src={normalizedAvatar}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full size-10 object-cover"
              key={`${normalizedAvatar}-${Date.now()}`} // 강제 리렌더링을 위한 key 추가
              unoptimized={normalizedAvatar.includes('supabase')} // Supabase 이미지는 최적화 비활성화
              priority={true}
              onLoad={() => {
                console.log('프로필 섹션 이미지 로드 완료:', normalizedAvatar);
              }}
              onError={(e) => {
                console.error(
                  '프로필 섹션 이미지 로드 실패:',
                  normalizedAvatar
                );
                // 이미지 로드 실패 시 기본 아이콘으로 대체
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="size-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg class="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="size-5 text-gray-400" />
            </div>
          )}
          <div className="flex gap-1 items-center">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-foreground bg-gray-100 text-xs rounded-md px-2 py-1">
              {role === 'admin'
                ? '관리자'
                : role === 'manager'
                ? '매니저'
                : '일반'}
            </p>
          </div>
        </div>
        <Button variant={'link'} onClick={() => setOpen(true)}>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Button>
      </div>
    </div>
  );
}
