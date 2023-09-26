import HydratedComponent from "@/app/utils/HydratedComponent";
import getQueryClient from "@/app/utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import React from "react";
import StoreArticle from "./StoreArticle";
import { getDocStore } from "@/lib/firebase/store";
import { getReviewList } from "@/lib/firebase/review";

export const generateMetadata = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const storeDoc = await getDocStore(id);
  const storeName = storeDoc?.storeName;
  return {
    title: storeName,
  };
};

const StorePage = async ({ params: { id } }: { params: { id: string } }) => {
  const pageParam = 0;
  const isFiltered = false;
  const sort = "최신순";
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["storeInfo", id], () => getDocStore(id));
  // await queryClient.prefetchQuery(["reviewInfo", id], () =>
  //   getReviewList(id, pageParam, isFiltered, sort).then((data) => {
  //     return {
  //       pages: [data],
  //     };
  //   })
  // );
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="pt-7 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <HydratedComponent state={dehydratedState}>
          <StoreArticle id={id} />
        </HydratedComponent>
      </div>
    </main>
  );
};

export default StorePage;
