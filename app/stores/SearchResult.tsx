"use client";

import { StoreSearchDocumentData } from "@/interface/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import StoreInfo from "./[id]/StoreInfo";
import { BsChatDots } from "react-icons/bs";
import { findStore } from "@/lib/firebase/store";

const SearchResult = () => {
  const searchParams = useSearchParams();
  const searchInput = searchParams.get("search");
  const [noResult, setNoResult] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const router = useRouter();

  const {
    data: storeId,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery<StoreSearchDocumentData | undefined>(
    ["storePageSearch", searchInput],
    ({ pageParam = 0 }) => findStore(pageParam, searchInput),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          if (lastPage.storeList.length < 5) return null;
          return lastPage.nextPageParam;
        }
      },
    }
  );

  useEffect(() => {
    if (storeId?.pages[0] && storeId?.pages?.length > 0) {
      if (storeId.pages[0].storeList.length < 1) {
        setNoResult(true);
      } else {
        setNoResult(false);
      }

      const isLast = storeId.pages[storeId.pages.length - 1]?.hasNextPage
        ? false
        : true;
      setIsLast(isLast);
    }
  }, [storeId]);

  const handlePage = () => {
    fetchNextPage();
  };

  return (
    <>
      <ul className=" flex flex-col items-center md:w-full max-w-xl w-[350px] rounded-2xl mt-2 p-2">
        {isFetching ? (
          <div className="animate-spin mt-4">
            <CgSpinner className="text-neutral-content text-4xl" />
          </div>
        ) : null}
        {noResult ? (
          <li className="h-[100px] w-full flex flex-col items-center rounded-2xl">
            <BsChatDots size={20} className="my-3" />
            <p>등록된 리뷰가 없습니다.</p>
          </li>
        ) : (
          storeId?.pages.map((page) =>
            page?.storeList.map((store) => (
              <li
                key={store}
                onClick={() => router.push(`/stores/${store}`)}
                className="cursor-pointer hover:bg-white transition duration-300 ease-in-out rounded-2xl pt-1 pl-1"
              >
                <StoreInfo id={store} asArticle={false} />
              </li>
            ))
          )
        )}
      </ul>
      {!isLast ? (
        <button
          onClick={handlePage}
          className="btn btn-ghost w-3/4 sm:w-1/3 bg-base-200 hover:bg-base-300"
        >
          더보기
        </button>
      ) : null}
    </>
  );
};

export default SearchResult;
