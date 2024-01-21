"use client";

import { BsTelephoneFill } from "react-icons/bs";
import Image from "next/image";
import StarRate from "@/components/StarRate";
import { useQuery } from "@tanstack/react-query";
import { getDocStore, getThumbnailUrl } from "@/lib/firebase/store";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";
import KakaoMapLoading from "./KakaoMapLoading";

const KakaoMap = dynamic(() => import("./KakaoMap"), {
  loading: () => <KakaoMapLoading />,
});

const StoreInfo = ({ id, asArticle }: { id: string; asArticle: boolean }) => {
  const { data: storeImage } = useQuery(["storeImage", id], () =>
    getThumbnailUrl(`store/${id}`)
  );
  const { data: storeDoc } = useQuery(["storeInfo", id], () => getDocStore(id));
  const averageRate = storeDoc
    ? storeDoc?.ttlParticipants == 0
      ? "0"
      : (storeDoc.ttlRate / storeDoc.ttlParticipants).toFixed(1).toString()
    : "0";

  return (
    <>
      {asArticle && (
        <h2 className="font-semibold  mb-4 text-lg flex justify-center items-center mx-auto w-fit px-7 h-12 rounded-full bg-white shadow ">
          {storeDoc?.storeName}
        </h2>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-xl">
        <div className="flex items-center justify-around md:justify-between mb-2 w-[350px] ">
          <div className="flex relative items-center justify-center w-[130px] h-[130px] md:w-[150px] md:h-[150px] bg-[#fff] mr-2 border border-neutral-300 rounded-xl overflow-hidden shrink-0">
            {storeImage ? (
              <Image
                src={storeImage}
                alt="리뷰이미지"
                priority
                fill
                sizes="(min-width: 768px) 150px, 130px"
                className="object-cover"
              />
            ) : (
              <i className="ico-coffeeBean text-base-200 text-5xl"></i>
            )}
          </div>

          <div className="flex flex-col justify-between w-[170px] md:w-[400px] ml-1 md:ml-4">
            <p className=" text-sm text-left mb-1 font-semibold">
              {storeDoc?.storeName}
            </p>
            <p className=" text-sm text-left mb-1 font-semibold">
              {storeDoc?.address}
            </p>
            <div className=" md:text-sm text-xs text-left">
              {storeDoc?.phone === "" ? null : (
                <>
                  <BsTelephoneFill
                    className="inline-block mr-1 -mt-0.5"
                    size="11"
                  />
                  <p className="inline-block">{storeDoc?.phone}</p>
                </>
              )}
            </div>
            <div className="flex w-[140px] justify-between ">
              <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                {averageRate}
              </span>
              <StarRate rate={averageRate} />
              <span className="inline-block mt-0.5">
                ({storeDoc?.ttlParticipants})
              </span>
            </div>
          </div>
        </div>
        {asArticle && <KakaoMap info={storeDoc} />}
      </div>
    </>
  );
};

export default StoreInfo;
