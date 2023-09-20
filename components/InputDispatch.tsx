"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";

const InputDispatch = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/stores?search=${searchInput}`);
  };

  return (
    <div className="relative ">
      <form
        onSubmit={handleSubmit}
        className="input-group flex justify-center border border-sub-color relative w-full rounded-full shadow"
      >
        <SearchInput
          value={searchInput}
          dispatchValue={setSearchInput}
          placeHolder="지하철역 or 카페명으로 리뷰를 찾아보세요."
        />
      </form>
    </div>
  );
};
export default InputDispatch;
