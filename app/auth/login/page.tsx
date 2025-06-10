import { Hero } from '@/common/components/hero';
import { InputPair } from '@/common/components/input-pair';
import { Button } from '@/common/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center h-full">
      <Hero title="브랜드마켓 관리자 로그인" />
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="font-bold p-4 text-center">
          안녕하세요. 매장 관리를 위해 로그인해주세요!
        </h2>
        <form className="flex flex-col w-[400px] border-1 border-black/10 bg-white p-4 rounded-lg  shadow-2xl items-center justify-center gap-6">
          <div className="flex flex-col gap-2 w-full">
            <InputPair
              label="아이디"
              id="id"
              className="w-full"
              // onChange={() => {}}
            />
            <span className="text-sm text-red-500">아이디를 입력해주세요.</span>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <InputPair
              label="비밀번호"
              id="password"
              className="w-full"
              // onChange={() => {}}
            />
            <span className="text-sm text-red-500">
              비밀번호를 입력해주세요.
            </span>
          </div>
          <Button className="w-full">로그인</Button>
        </form>
      </div>
    </div>
  );
}
