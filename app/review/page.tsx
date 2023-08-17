import ReviewForm from "@/components/review/ReviewForm";
import StoreSearch from "@/components/review/StoreSearch";

const ReviewPage = () => {
  return (
    <main className="py-16">
      <article className="flex-col justify-center mx-auto md:max-w-3xl py-3 px-4 rounded-3xl border border-base-200 shadow text-base-dark-color">
        <h2 className="flex justify-center items-center -translate-y-9 mx-auto w-40  h-10  font-semibold rounded-full shadow bg-base-100 text-base-dark-color ">
          리뷰 작성하기
        </h2>
        <ReviewForm />
      </article>
    </main>
  );
};

export default ReviewPage;
