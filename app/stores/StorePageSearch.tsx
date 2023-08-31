"use client";

import SearchInput from "@/components/SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchResult from "./SearchResult";

const StorePageSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsInput = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchParamsInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/stores?search=${searchInput}`);
  };

  return (
    <>
      <div className="relative w-full max-w-lg">
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
    </>
  );
};

export default StorePageSearch;