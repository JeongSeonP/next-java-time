import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SearchInput from "../../components/SearchInput";
import SearchedStores from "./SearchedStores";
import { getSearchedStoreInfo } from "@/lib/kakaoAPI";

export interface StoreProps {
  id: string;
  place_name: string;
  phone: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface StoreSearchProps {
  dispatch: Dispatch<
    SetStateAction<{
      id: string;
      phone: string;
      storeName: string;
      address: string;
      x: string;
      y: string;
    }>
  >;
}

const StoreSearch = ({ dispatch }: StoreSearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedList, setSearchedLIst] = useState<StoreProps[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [resultModal, setResultModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput == "") return;
    setResultModal(true);
    setSearchedLIst([]);
    setPage(page);
    getPage(page);
  };

  const handlePage = () => {
    const curPage = page + 1;
    setPage(curPage);
    getPage(curPage);
  };

  const getSelectedStore = (selectedID: string) => {
    const store: StoreProps | undefined = searchedList.find(
      (store) => store.id === selectedID
    );
    if (store) {
      const selectedStore = {
        id: store.id,
        phone: store.phone,
        storeName: store.place_name,
        address: store.road_address_name,
        x: store.x,
        y: store.y,
      };
      dispatch(selectedStore);
      setResultModal(false);
      setSearchInput("");
    }
  };

  const getPage = async (page: number) => {
    if (searchInput === "") return;
    const [storeInfos, isEnd] = await getSearchedStoreInfo(searchInput, page);
    if (storeInfos.length === 0) {
      setNoResult(true);
      setLastPage(true);
      setSearchedLIst([]);
      return;
    } else {
      setLastPage(false);
      setNoResult(false);
    }

    if (isEnd) {
      setLastPage(isEnd);
    }
    if (page !== 1) {
      const newStoreList = searchedList.concat(storeInfos);
      setSearchedLIst(newStoreList);
    } else {
      setSearchedLIst(storeInfos);
    }
  };

  useEffect(() => {
    if (searchInput === "") {
      setPage(1);
      setNoResult(false);
      setResultModal(false);
    }
  }, [searchInput]);

  return (
    <>
      <div className="flex justify-center items-center  w-full ">
        <div className=" w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="relative z-[9998] input-group flex justify-center border border-base-300 w-full rounded-full shadow-sm"
          >
            <SearchInput
              value={searchInput}
              dispatchValue={setSearchInput}
              placeHolder="리뷰 작성할 카페이름을 검색해보세요"
            />
          </form>
          {resultModal ? (
            <div className="absolute w-full max-w-lg bg-base-200 rounded-xl overflow-hidden shadow-md text-center">
              {noResult ? (
                <div className="w-[350px] p-6 text-sm">
                  검색결과가 없습니다.
                </div>
              ) : (
                <SearchedStores
                  storeList={searchedList}
                  dispatchID={getSelectedStore}
                />
              )}
              {lastPage ? null : (
                <button
                  onClick={handlePage}
                  className="btn btn-sm btn-ghost w-3/4 bg-base-100 hover:bg-base-300 mb-2"
                >
                  더보기
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default StoreSearch;
