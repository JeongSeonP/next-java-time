import { Suspense } from "react";
import StoreArticle from "./StoreArticle";
import { getDocStore } from "@/lib/firebase/store";
import ReviewSection from "./ReviewSection";
import StoreInfoLoading from "./StoreInfoLoading";
import LoadingSpinner from "@/components/LoadingSpinner";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const storeDoc = await getDocStore(id);
  if (!storeDoc) {
    notFound();
  }
  const storeName = storeDoc?.storeName;
  return {
    title: storeName,
  };
};

const StorePage = async ({ params: { id } }: { params: { id: string } }) => {
  return (
    <main className="pt-7 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <Suspense fallback={<StoreInfoLoading />}>
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
