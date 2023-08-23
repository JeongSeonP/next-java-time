import StarRate from "@/components/StarRate";
import { flavorList, richnessList } from "@/constants/selectOptions";
import { ReviewDocData } from "@/interface/review";
import { auth, deleteReview, getDocStore, getReviewList } from "@/lib/firebase";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { BsCheck, BsPencil, BsTrash } from "react-icons/Bs";
import ConfirmModal from "./ConfirmModal";
import CommentInput from "./CommentInput";
import Comments from "./Comments";
import Dropdown from "./Dropdown";
import ProfileModal from "./ProfileModal";
import InformModal from "@/components/InformModal";
import { SHOW_MODAL_DELAY } from "@/constants/modalTime";
import ImageModal from "./ImageModal";
import getFormattedDate from "@/app/utils/getFormattedDate";

export interface ReviewDocumentData extends DocumentData {
  reviewList: ReviewDocData[];
  nextPage: string;
  hasNextPage: boolean;
}

export interface DeleteOption {
  storeId: string;
  reviewID: string;
  rating: string;
}

const Review = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [confirmModal, setConfirmModal] = useState(false);
  const [informModal, setInformModal] = useState(false);
  const [imageModal, setImageModal] = useState<string | null | false>(false);
  const [isLast, setIsLast] = useState(false);
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState("최신순");
  const [deleteOption, setDeleteOption] = useState<DeleteOption | null>(null);
  const sortList = ["최신순", "평점순"];
  const { data: storeDoc } = useQuery(["storeInfo", id], () => getDocStore(id));
  const {
    data: reviewDoc,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<ReviewDocumentData | undefined>(
    ["reviewInfo", id],
    ({ pageParam = 0 }) => getReviewList(id, pageParam, filter, sort),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          if (lastPage.reviewList.length < 5) return null;
          return lastPage.nextPage;
        }
      },
    }
  );

  const modalOption = {
    h3: "리뷰를 정말 삭제하시겠습니까?",
    p: "삭제하시려면 확인 버튼을 눌러주세요.",
    button: "확인",
    secondButton: "취소",
  };

  useEffect(() => {
    refetch();
  }, [filter, sort, refetch]);

  useEffect(() => {
    if (reviewDoc?.pages && reviewDoc.pages?.length > 0) {
      const isLast = reviewDoc?.pages[reviewDoc.pages.length - 1]?.hasNextPage
        ? false
        : true;

      setIsLast(isLast);
    }
  }, [reviewDoc]);

  const { mutate: reviewMutate, isLoading } = useMutation(deleteReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewInfo", id]);
      queryClient.invalidateQueries(["storeInfo", id]);
      setTimeout(() => {
        setInformModal(false);
      }, SHOW_MODAL_DELAY);
    },
  });

  const handlePage = () => {
    fetchNextPage();
  };

  const goToReview = () => {
    if (storeDoc) {
      const store = {
        id: storeDoc.id,
        phone: storeDoc.phone,
        storeName: storeDoc.storeName,
        address: storeDoc.address,
        x: storeDoc.x,
        y: storeDoc.y,
      };
      sessionStorage.setItem("selectedStore", JSON.stringify(store));
    }
    router.push("/review");
  };

  const handleRevision = (review: ReviewDocData) => {
    const revisionOption = {
      reviewID: review.reviewID,
      rating: review.rating,
      img: review.image,
      flavor: review.flavor,
      richness: review.richness,
      text: review.text,
    };
    sessionStorage.setItem("revisionOption", JSON.stringify(revisionOption));
    goToReview();
  };

  const handleDelete = (reviewID: string, rating: string) => {
    const storeId = id;
    setDeleteOption({ storeId, reviewID, rating });
    setConfirmModal(true);
  };

  const confirmDelete = (answer: boolean) => {
    if (answer && deleteOption) {
      setConfirmModal(false);
      setInformModal(true);
      reviewMutate(deleteOption);
    } else if (!answer) {
      setConfirmModal(false);
      setDeleteOption(null);
    }
  };

  return (
    <div className="md:w-full max-w-xl w-[350px] ">
      <button
        onClick={goToReview}
        className="btn btn-neutral text-sub-color md:w-full max-w-xl w-[350px] mb-1"
      >
        리뷰 쓰기
      </button>
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center">
          {sortList.map((sortItem) => (
            <button
              key={sortItem}
              onClick={() => setSort(sortItem)}
              className={`btn btn-ghost btn-xs  text-xs text-neutral-100 bg-base-300 hover:bg-base-200 hover:text-neutral-500
                ${sortItem === sort ? "text-neutral" : ""}`}
            >
              {sortItem === sort ? (
                <BsCheck size="18" className="-ml-1" />
              ) : null}
              {sortItem}
            </button>
          ))}
        </div>
        <label className="label cursor-pointer">
          <span
            className={`label-text font-semibold text-xs mr-1  ${
              !filter ? "text-neutral-500" : ""
            }`}
          >
            포토리뷰
          </span>
          <input
            onChange={(e) => setFilter(e.target.checked)}
            type="checkbox"
            className="toggle toggle-md toggle-primary"
            defaultChecked={false}
          />
        </label>
      </div>
      <ul className=" text-xs md:text-sm">
        {reviewDoc?.pages.map((page) =>
          page?.reviewList.map((review: ReviewDocData) => (
            <li
              key={review.reviewID}
              className="w-full text-right border-2 border-base-200 rounded-xl bg-[#fff] my-1 p-3"
            >
              <div className="flex justify-between items-center mb-1.5">
                <ProfileModal user={review.user} />

                <div className="flex justify-end items-center">
                  <span className="flex items-center my-1 font-semibold text-sm text-secondary-content">
                    {review.rating}
                  </span>
                  <StarRate rate={review.rating} />
                  {user?.uid === review.user.uid ? (
                    <Dropdown>
                      <li className="w-20">
                        <div
                          onClick={() => handleRevision(review)}
                          className="text-xs mx-auto "
                        >
                          <BsPencil size="14" />
                          <p className="shrink-0">수정</p>
                        </div>
                      </li>
                      <li className="w-20 text-error">
                        <div
                          onClick={() =>
                            handleDelete(review.reviewID, review.rating)
                          }
                          className="text-xs mx-auto"
                        >
                          <BsTrash size="14" />
                          <p className="shrink-0">삭제</p>
                        </div>
                      </li>
                    </Dropdown>
                  ) : null}
                </div>
              </div>
              <div className="flex text-xs justify-end text-primary-dark-color">
                <div className="mx-2">
                  <i className="ico-coffeeBean mr-1 text-[9px]"></i>
                  {flavorList[review.flavor]}
                </div>
                <div>
                  <i className="ico-coffeeBean mr-1 text-[9px]"></i>
                  {richnessList[review.richness]}
                </div>
              </div>
              <div className="flex flex-col justify-between text-left p-2 md:indent-3 bg-[#deeaea]/60 border border-base-200 text-secondary-content rounded-xl shadow my-1 min-h-[80px]">
                {review.image !== null ? (
                  <div
                    onClick={() => setImageModal(review.image)}
                    className="relative w-28 h-28 flex items-center justify-center bg-[#fff] overflow-hidden rounded-lg mb-2 shadow cursor-pointer"
                  >
                    <Image
                      src={review.image}
                      alt="리뷰이미지"
                      fill
                      sizes="112px"
                      className="object-cover"
                    />{" "}
                  </div>
                ) : null}

                <p>{review.text}</p>

                <div className="flex justify-end items-center italic rounded-xl bg-[#d3e5e5] px-2 shadow mt-1">
                  {review.isRevised ? (
                    <p className="mr-1 text-neutral-400 text-[10px]">
                      (편집됨)
                    </p>
                  ) : null}
                  <p>{getFormattedDate(review.date)}</p>
                </div>
              </div>

              <ul>
                {review.comments
                  ? review.comments.map((comment) => (
                      <Comments
                        key={comment.commentId}
                        storeId={id}
                        reviewId={review.reviewID}
                        comment={comment}
                      />
                    ))
                  : null}
              </ul>

              <CommentInput
                info={{ storeId: id, reviewId: review.reviewID }}
                prevComment={null}
                inputEditor={null}
              />
            </li>
          ))
        )}
      </ul>
      {!isLast ? (
        <button
          onClick={handlePage}
          className="btn btn-ghost w-3/4 sm:w-1/2 bg-base-200 hover:bg-base-300"
        >
          더보기
        </button>
      ) : null}
      <ConfirmModal
        toggle={confirmModal}
        handleRedirect={confirmDelete}
        option={modalOption}
      />
      {informModal && (
        <InformModal loading={isLoading} inform={"삭제 되었습니다!"} />
      )}
      {imageModal && <ImageModal src={imageModal} toggle={setImageModal} />}
    </div>
  );
};
export default Review;
