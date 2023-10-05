import { dehydrate } from "@tanstack/react-query";
import StoreInfo from "./StoreInfo";
import { getDocStore } from "@/lib/firebase/store";
import getQueryClient from "@/app/utils/getQueryClient";
import HydratedComponent from "@/app/utils/HydratedComponent";

const StoreArticle = async ({ id }: { id: string }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["storeInfo", id], () => getDocStore(id));
  const dehydratedState = dehydrate(queryClient);
  return (
    <article>
      <HydratedComponent state={dehydratedState}>
        <StoreInfo id={id} map={true} />
      </HydratedComponent>
    </article>
  );
};

export default StoreArticle;
