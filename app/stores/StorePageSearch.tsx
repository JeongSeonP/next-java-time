"use client";

import SearchInput from "@/components/SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";

const StorePageSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsInput = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchParamsInput);

  useEffect(() => {
    setSearchInput(searchParamsInput);
  }, [searchParamsInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/stores?search=${searchInput}`);
  };

  return (
    <>
      <div className="relative w-11/12 max-w-lg">
        <form
          role="search"
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
    </>
  );
};

export default StorePageSearch;
