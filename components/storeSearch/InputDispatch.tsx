"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import SearchInput from "../common/SearchInput";
import { searchedInput } from "@/store/SearchInputAtom";
import { useRouter } from "next/navigation";

const InputDispatch = () => {
  const [searchInput, setSearchInput] = useRecoilState(searchedInput);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/reviewsearch");
  };

  // useEffect(() => {
  //   setSearchInput("");
  // }, [setSearchInput]);

  return (
    <div className="relative ">
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
  );
};
export default InputDispatch;
