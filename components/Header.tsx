"use client";

import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import InputDispatch from "./InputDispatch";
import MyMenu from "./MyMenu";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();
  const path = pathname !== "/" && pathname !== "/reviewsearch" ? true : false;

  useEffect(() => {
    setToggle(false);
  }, [pathname]);

  return (
    <header className="h-14 sm:h-24 px-7 sm:p-4 bg-base-200 flex justify-between items-center fixed top-0 left-0 right-0 z-[99999] shadow">
      <div className="w-full md:w-4/6 mx-auto flex justify-between items-center">
        <h1 className="sm:w-40 w-10 text-2xl">
          <Link
            href={"/"}
            className="flex justify-start sm:justify-center items-center"
          >
            <i className="ico-coffeeBean inline-block px-2 sm:text-2xl text-3xl "></i>
            <span className="sr-only sm:not-sr-only">JAVA TIME</span>
          </Link>
        </h1>
        <div className="flex justify-center items-center">
          {path ? (
            <button
              onClick={() => setToggle(true)}
              aria-label="카페검색창활성화버튼"
            >
              <BiSearch size="29" className="mr-4 mt-1 text-sub-color" />
            </button>
          ) : null}
          <MyMenu />
        </div>
      </div>
      <div
        onClick={() => setToggle(false)}
        className={` modal z-[99998]  ${
          toggle && `visible opacity-100 pointer-events-auto bg-transparent`
        }`}
      ></div>
      <div
        className={`modal z-[99999]  absolute  w-full top-[53px] sm:top-[93px] h-14
        ${toggle && `visible opacity-100 pointer-events-auto bg-transparent `}`}
      >
        <div className=" w-full md:max-w-lg">
          <InputDispatch />
        </div>
      </div>
    </header>
  );
};

export default Header;
