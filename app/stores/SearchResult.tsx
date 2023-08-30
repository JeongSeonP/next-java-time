"use client";

import { StoreSearchDocumentData } from "@/interface/store";
import { findStore } from "@/lib/firebase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SearchResult = () => {
  const searchParams = useSearchParams();
  const searchInput = searchParams.get("search");
  const text = useParams;

  const {
    data: storeId,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<StoreSearchDocumentData | undefined>(
    ["storePageSearch", searchInput],
    ({ pageParam = 0 }) => findStore(pageParam, searchInput),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          if (lastPage.storeList.length < 5) return null;
          return lastPage.nextPage;
        }
      },
    }
  );

  useEffect(() => {
    console.log(storeId);
  }, [storeId]);

  return (
    <>
      <ul className=" flex flex-col items-center md:w-full max-w-xl w-[350px] rounded-2xl mt-2 p-2">
        {/* {isLoading ? (
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
    )} */}
      </ul>
      {/* {count > 0 ? (
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

export default SearchResult;
