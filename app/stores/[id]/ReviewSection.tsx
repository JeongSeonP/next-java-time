import Review from "./Review";
import getQueryClient from "@/app/utils/getQueryClient";
import { getReviewList } from "@/lib/firebase/review";
import { Hydrate, dehydrate } from "@tanstack/react-query";

const ReviewSection = async ({ id }: { id: string }) => {
  const pageParam = 0;
  const isFiltered = false;
  const sort = "최신순";
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["reviewInfo", id], () =>
    getReviewList(id, pageParam, isFiltered, sort).then((data) => {
      return {
        pages: [data],
      };
    })
  );
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Review id={id} />
    </Hydrate>
  );
};

export default ReviewSection;
