import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getThumbnailUrl } from "@/lib/firebase";
import { StoreDocumentData } from "@/interface/store";
import StarRate from "./StarRate";

interface TableItemProps {
  store: StoreDocumentData;
  idx: number;
}

const TableItem = ({ store, idx }: TableItemProps) => {
  const router = useRouter();
  const [storeImage, setStoreImage] = useState<string | null>(null);

  const averageRate =
    store.ttlParticipants == 0
      ? "0"
      : (store.ttlRate / store.ttlParticipants).toFixed(1).toString();

  useEffect(() => {
    const refPath = `store/${store.id}`;
    const getUrl = async () => {
      const url = await getThumbnailUrl(refPath);
      if (url) {
        setStoreImage(url);
      }
    };
    getUrl();
  }, [store]);

  return (
    <div
      onClick={() => router.push(`/stores/${store.id}`)}
      className="card bg-base-100 shadow-xl cursor-pointer"
    >
      <figure className="h-48 bg-base-200 relative">
        {storeImage ? (
          <Image
            src={storeImage}
            priority={idx < 2}
            alt="리뷰이미지"
            fill
            sizes="(min-width: 768px) 45vw, (min-width: 1024px) 30vw, 90vw "
            className="object-cover"
          />
        ) : (
          <i className="ico-coffeeBean text-base-300 text-7xl"></i>
        )}
      </figure>
      <div className="card-body h-28 py-2 px-4 gap-0">
        <h2 className="card-title text-sm md:text-[16px]">{store.storeName}</h2>
        <div className="flex w-[140px] justify-between ">
          <span className="inline-block mt-0.5 font-semibold text-secondary-content">
            {averageRate}
          </span>
          <StarRate rate={averageRate} />
          <span className="inline-block mt-0.5">({store.ttlParticipants})</span>
        </div>
        <div className="card-actions justify-end">
          <button
            onClick={() => router.push(`/stores/${store.id}`)}
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
