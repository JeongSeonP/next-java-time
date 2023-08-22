import Link from "next/link";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

const NotFound = () => {
  return (
    <main>
      <div className="text-center pt-10 flex flex-col justify-center items-center">
        <HiOutlineChatBubbleOvalLeftEllipsis size={20} />
        <div className="mt-2">업체 정보가 없습니다.</div>
        <Link href={"/"} className="link link-primary text-sm text- mt-3">
          홈으로 가기
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
