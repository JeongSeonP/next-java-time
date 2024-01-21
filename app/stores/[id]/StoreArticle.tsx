import { Hydrate, dehydrate } from "@tanstack/react-query";
import StoreInfo from "./StoreInfo";
import { getDocStore } from "@/lib/firebase/store";
import getQueryClient from "@/app/utils/getQueryClient";

const StoreArticle = async ({ id }: { id: string }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["storeInfo", id], () => getDocStore(id));
  const dehydratedState = dehydrate(queryClient);
  return (
    <article>
      <Hydrate state={dehydratedState}>
        <StoreInfo id={id} asArticle={true} />
      </Hydrate>
    </article>
  );
};

export default StoreArticle;
