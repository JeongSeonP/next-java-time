"use client";

import SearchInput from "@/components/SearchInput";
import { findStore, findStoreA } from "@/lib/firebase";
import { DocumentData } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/Cg";
import { useRecoilState } from "recoil";
import StoreInfo from "./[id]/StoreInfo";
import { useInfiniteQuery } from "@tanstack/react-query";
import { StoreSearchDocumentData } from "@/interface/store";
import SearchResult from "./SearchResult";

const StorePageSearch = () => {
  const [noResult, setNoResult] = useState(false);
  const [count, setCount] = useState(0);
  const [searchedList, setSearchedLIst] = useState<string[][] | null>(null);
  const [page, setPage] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsInput = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchParamsInput);

  // useEffect(() => {
  //   if (searchInput !== "") {
  //     setNoResult(false);
  //     setSearchedLIst(null);
  //     getResult();
  //     setIsLoading(true);
  //   }
  //   return () => setSearchInput("");
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/stores?search=${searchInput}`);
    // setCount(0);
    // setNoResult(false);
    // setPage(null);
    // getResult();
    // setIsLoading(true);
  };

  // const getResult = async () => {
  //   if (searchInput === "") return;

  //   const result = await findStoreA(searchInput);
  //   console.log(result);
  //   const perPage = 5;
  //   if (result.length > 0) {
  //     setNoResult(false);
  //     const pages = [];
  //     for (let i = 0; i < result.length; i += perPage) {
  //       pages.push(result.slice(i, i + perPage));
  //     }
  //     setSearchedLIst(pages);
  //     setCount(pages.length - 1);
  //     setPage(pages[0]);
  //   } else {
  //     setNoResult(true);
  //     setSearchedLIst([]);
  //   }
  //   setIsLoading(false);
  // };

  // const handlePage = () => {
  //   setCount((pre) => pre + 1);
  //   if (page && searchedList) {
  //     if (count >= searchedList?.length - 1) {
  //       setCount(0);
  //     }
  //     const nextPage = page?.concat(searchedList[count]);
  //     setPage(nextPage);
  //   }
  // };
  return (
    <>
      <div className="relative w-[350px]">
        <form
          onSubmit={handleSubmit}
          className="input-group flex justify-center border border-base-300 relative w-full rounded-full shadow-sm"
        >
          <SearchInput
            value={searchInput}
            dispatchValue={setSearchInput}
            placeHolder="지하철역 or 카페명으로 리뷰를 찾아보세요."
          />
        </form>
      </div>
      <SearchResult />
      {/* <ul className=" flex flex-col items-center md:w-full max-w-xl w-[350px] rounded-2xl mt-2 p-2">
        {isLoading ? (
          <div className="animate-spin mt-4">
            <CgSpinner className="ico-coffeeBean text-neutral-content text-4xl" />
          </div>
        ) : null}
        {noResult ? (
          <li className="h-[100px] w-full flex items-center rounded-2xl">
            등록된 리뷰가 없습니다.
          </li>
        ) : (
          page?.map((store) => (
            <li
              key={store}
              onClick={() => router.push(`/stores/${store}`)}
              className="cursor-pointer hover:bg-[#fff] transition duration-300 ease-in-out rounded-2xl pt-1 pl-1"
            >
              <StoreInfo id={store} map={false} />
            </li>
          ))
        )}
      </ul>
      {count > 0 ? (
        <button
          onClick={handlePage}
          className="btn btn-ghost w-3/4 sm:w-1/3 bg-base-200 hover:bg-base-300"
        >
          더보기
        </button>
      ) : null} */}
    </>
  );
};

export default StorePageSearch;
