"use client";

import { usePathname } from "next/navigation";
import { BiUpArrowAlt } from "react-icons/bi";

const TopBtn = () => {
  const pathname = usePathname();
  const exceptPath = ["/login", "/join", "/mypage"];
  const path = exceptPath.includes(pathname) ? false : true;

  if (!path) return;

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <>
      <button
        onClick={scrollToTop}
        className="md:fixed absolute w-10 h-10 rounded-full shadow-md md:bottom-5 md:right-10 bottom-[230px] translate-x-1/2 right-1/2 bg-[#fff] "
      >
        <BiUpArrowAlt className="text-base-300" size="20" />
      </button>
    </>
  );
};
export default TopBtn;
