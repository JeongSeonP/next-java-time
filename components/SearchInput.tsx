"use client";

import { Dispatch, SetStateAction } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";

interface props {
  value: string;
  dispatchValue: Dispatch<SetStateAction<string>>;
  placeHolder: string;
}

const SearchInput = ({ value, dispatchValue, placeHolder }: props) => {
  return (
    <>
      <input
        type="search"
        value={value}
        onChange={(e) => dispatchValue(e.target.value)}
        placeholder={placeHolder}
        spellCheck={false}
        name="storeSearchInput"
        className="input input-bordered border-none w-full bg-white placeholder:text-xs focus:outline-none"
      />
      {value === "" ? null : (
        <button
          type="button"
          onClick={() => dispatchValue("")}
          className="w-3 h-3 border  rounded-full  flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-14"
        >
          <IoIosClose />
        </button>
      )}

      <button
        className="btn btn-square bg-white hover:bg-white border-none"
        aria-label="검색버튼"
      >
        <BiSearch size="24" className="text-sub-color" />
      </button>
    </>
  );
};

export default SearchInput;
