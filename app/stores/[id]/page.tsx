import HydratedComponent from "@/app/utils/HydratedComponent";
import getQueryClient from "@/app/utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import StoreArticle from "./StoreArticle";
import { getDocStore } from "@/lib/firebase/store";
import ReviewSection from "./ReviewSection";
import StoreArticleLoading from "./StoreArticleLoading";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  return (
    <main className="pt-7 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <Suspense fallback={<StoreArticleLoading />}>
          <StoreArticle id={id} />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ReviewSection id={id} />
        </Suspense>
      </div>
    </main>
  );
};

export default StorePage;
