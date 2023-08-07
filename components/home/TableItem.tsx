import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { StoreDocumentData } from "./Table";
// import { getThumbnailUrl, storage } from "../api/firebase";
// import { getDownloadURL, list, ref } from "firebase/storage";
// import StarRate from "./StarRate";
import Image from "next/image";
import StarRate from "@/components/common/StarRate";

interface Props {
  store: StoreDocumentData;
}

const TableItem = ({ store }: Props) => {
  // const navigate = useNavigate();
  const [storeImage, setStoreImage] = useState<string | null>(null);

  const averageRate = (store.ttlRate / store.ttlParticipants)
    .toFixed(1)
    .toString();

  useEffect(() => {
    const refPath = `store/${store.id}`;
    const getUrl = async () => {
      // const url = await getThumbnailUrl(refPath);
      // if (url) {
      //   setStoreImage(url);
      // }
    };
    getUrl();
  }, [store]);

  return (
    <div
      // onClick={() => navigate(`/store/${store.id}`)}
      className="card bg-base-100 shadow-xl cursor-pointer"
    >
      <figure className="h-48 bg-base-200">
        {storeImage ? (
          <Image src={storeImage} alt="리뷰이미지" />
        ) : (
          <i className="ico-coffeeBean text-base-300 text-7xl"></i>
        )}
      </figure>
      <div className="card-body h-28 py-2 px-4 gap-0">
        <h2 className="card-title text-[17px] md:text-[16px]">
          {store.storeName}
        </h2>
        <div className="flex w-[140px] justify-between ">
          <span className="inline-block mt-0.5 font-semibold text-secondary-content">
            {averageRate}
          </span>
          <StarRate rate={averageRate} />
          <span className="inline-block mt-0.5">({store.ttlParticipants})</span>
        </div>
        <div className="card-actions justify-end">
          <button
            // onClick={() => navigate(`/store/${store.id}`)}
            className="btn btn-ghost btn-sm text-xs bg-base-200 hover:bg-base-300"
          >
            더보러가기
          </button>
        </div>
      </div>
    </div>
  );
};
export default TableItem;
