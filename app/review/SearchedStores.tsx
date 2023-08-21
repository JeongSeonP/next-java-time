interface StoreProps {
  id: string;
  place_name: string;
  road_address_name: string;
  phone: string;
}

interface SearchedStoreProps {
  storeList: StoreProps[];
  dispatchID: (selectedID: string) => void;
}

const SearchedStores = ({ storeList, dispatchID }: SearchedStoreProps) => {
  return (
    <ul className="py-3 px-1 mx-auto bg-base-200  w-full">
      {storeList.length > 0
        ? storeList.map((store) => (
            <li
              key={store.id}
              className="flex justify-start items-center   p-2 border-b border-white hover:bg-base-100 rounded-xl transition duration-100 ease-in-out"
            >
              <input
                type="radio"
                name="radio-store"
                className="radio hidden"
                id={store.id}
                required
                onChange={(e) => dispatchID(e.target.id)}
              />
              <label
                htmlFor={store.id}
                className="p-1 w-full flex md:justify-between"
              >
                <div className="w-full  flex items-center justify-between ml-2 truncate">
                  <p className="text-left text-sm font-semibold w-1/3 md:leading-loose whitespace-normal">
                    {store.place_name}
                  </p>
                  <div className="w-[40%] flex flex-col md:justify-center">
                    <p className="truncate text-xs text-left">
                      {store.road_address_name}
                    </p>
                    <p className="truncate text-xs text-left">{store.phone}</p>
                  </div>
                  <p className="text-left text-xs my-1 hover:bg-base-300 bg-base-100 p-1 rounded-full">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://place.map.kakao.com/${store.id}`}
                    >
                      업체정보
                    </a>
                  </p>
                </div>
              </label>
            </li>
          ))
        : null}
    </ul>
  );
};

export default SearchedStores;
