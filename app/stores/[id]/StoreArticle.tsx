"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import StoreInfo from "./StoreInfo";
import Review from "./Review";
import { getDocStore } from "@/lib/firebase/store";

const StoreArticle = ({ id }: { id: string }) => {
  const { data: storeDoc } = useQuery(["storeInfo", id], () => getDocStore(id));
  if (!storeDoc) {
    notFound();
  }
  return (
    <article>
      <h2 className="font-semibold  mb-4 text-lg flex justify-center items-center mx-auto w-fit px-7 h-12 rounded-full bg-white shadow ">
        {storeDoc.storeName}
      </h2>
      <StoreInfo id={id} map={true} />
      <Review id={id} />
    </article>
  );
};

export default StoreArticle;
