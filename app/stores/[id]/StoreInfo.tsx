import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsTelephoneFill } from "react-icons/Bs";
import Image from "next/image";
import { getThumbnailUrl } from "@/lib/firebase";
import StarRate from "@/components/StarRate";
import KakaoMap from "./KakaoMap";

interface Props {
  storeDoc: DocumentData;
  map: boolean;
}

const StoreInfo = ({ storeDoc, map }: Props) => {
  const [storeImage, setStoreImage] = useState<string | null>(null);
  const averageRate = (storeDoc.ttlRate / storeDoc.ttlParticipants)
    .toFixed(1)
    .toString();

  useEffect(() => {
    const refPath = `store/${storeDoc.id}`;
    const getUrl = async () => {
      const url = await getThumbnailUrl(refPath);
      if (url) {
        setStoreImage(url);
      }
    };
    getUrl();
  }, [storeDoc]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-xl">
        <div className="flex items-center justify-around md:justify-between mb-2 w-[350px] ">
          <div className="flex relative items-center justify-center w-[130px] h-[130px] md:w-[150px] md:h-[150px] bg-[#fff] mr-2 border border-neutral-300 rounded-xl overflow-hidden shrink-0">
            {storeImage ? (
              <Image
                src={storeImage}
                alt="리뷰이미지"
                fill={true}
                className="object-cover"
              />
            ) : (
              <i className="ico-coffeeBean text-base-200 text-5xl"></i>
            )}
          </div>

          <div className="flex flex-col justify-between w-[170px] md:w-[400px] ml-1 md:ml-4">
            <p className=" text-sm text-left mb-1 font-semibold">
              {storeDoc.storeName}
            </p>
            <p className=" text-sm text-left mb-1 font-semibold">
              {storeDoc.address}
            </p>
            <div className=" md:text-sm text-xs text-left">
              {storeDoc.phone === "" ? null : (
                <>
                  <BsTelephoneFill
                    className="inline-block mr-1 -mt-0.5"
                    size="11"
                  />
                  <p className="inline-block">{storeDoc.phone}</p>
                </>
              )}
            </div>
            <div className="flex w-[140px] justify-between ">
              <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                {averageRate}
              </span>
              <StarRate rate={averageRate} />
              <span className="inline-block mt-0.5">
                ({storeDoc.ttlParticipants})
              </span>
            </div>
          </div>
        </div>
        {map ? <KakaoMap info={storeDoc} /> : null}
      </div>
    </>
  );
};

export default StoreInfo;
