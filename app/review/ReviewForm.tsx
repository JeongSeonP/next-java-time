"use client";

import StoreSearch from "./StoreSearch";
import { useForm } from "react-hook-form";
import { ReviewForm, RevisionOption } from "@/interface/review";
import { useEffect, useState } from "react";
import { flavorList, richnessList } from "@/constants/selectOptions";
import {
  auth,
  deleteImg,
  deleteReviewImage,
  getImgUrl,
  getImgUrlList,
  getReviewImageUrl,
  setDocReview,
  storage,
} from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdError } from "react-icons/md";
import { getStation } from "@/lib/kakaoAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SHOW_MODAL_DELAY } from "@/constants/modalTime";
import InformModal from "@/components/InformModal";
import MultiImageUploader, {
  MultiImagefile,
} from "@/components/MultiImageUploader";
import { getDownloadURL, ref } from "firebase/storage";

const ReviewForm = () => {
  const [user] = useAuthState(auth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [existingReview, setExistingReview] = useState<RevisionOption | null>(
    null
  );
  const [imgFile, setImgFile] = useState<MultiImagefile | null>(null);
  const [modal, setModal] = useState(false);
  const [inform, setInform] = useState("리뷰가 등록되었습니다!");
  const [store, setStore] = useState({
    id: "",
    phone: "",
    storeName: "",
    address: "",
    x: "",
    y: "",
  });
  const {
    register,
    formState: { errors },
    handleSubmit: onSubmit,
    watch,
    reset,
  } = useForm<ReviewForm>({
    mode: "onSubmit",
    defaultValues: {
      rating: "0",
      flavor: "",
      richness: "",
      text: "",
    },
  });

  const { mutate: reviewMutate, isLoading } = useMutation(setDocReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(["storeInfo"]);
      queryClient.invalidateQueries(["reviewInfo", store.id]);
      setTimeout(() => {
        router.replace(`/stores/${store.id}`);
      }, SHOW_MODAL_DELAY);
    },
  });

  const rate = watch("rating");

  useEffect(() => {
    const store = sessionStorage.getItem("selectedStore");
    if (!store) return;
    setStore(JSON.parse(store));

    const isRevision = sessionStorage.getItem("revisionOption");
    if (!isRevision) return;
    setExistingReview(JSON.parse(isRevision));

    return () => {
      sessionStorage.clear();
      setModal(false);
    };
  }, []);

  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        flavor: existingReview.flavor,
        richness: existingReview.richness,
        text: existingReview.text,
      });
    }

    if (existingReview?.img) {
      setImgFile({
        file: null,
        thumbnail: existingReview.img,
        name: "prevImg",
      });
    }
  }, [existingReview, reset]);

  const handleSubmit = async (formData: ReviewForm) => {
    if (store.id == "") {
      setInform("선택된 카페가 없습니다.");
      setModal(true);
      setTimeout(() => {
        setModal(false);
      }, SHOW_MODAL_DELAY);
      return;
    }
    setInform("리뷰가 등록되었습니다!");
    const createdDate = Number(new Date());
    const { rating, flavor, richness, text } = formData;
    const { x, y, id, phone, storeName, address } = store;
    const stations: string[] = await getStation(x, y);
    const stationList = [...new Set(stations)];

    const prevRating = existingReview ? existingReview.rating : null;
    const isRevised = existingReview ? true : false;
    const reviewID = existingReview
      ? existingReview.reviewID
      : `${id}_${Date.now()}`;

    const imgRef = `store/${store.id}/${reviewID}`;
    let url = null;

    if (imgFile?.file) {
      const imageDoc = {
        path: imgRef,
        imgFile: imgFile.file,
      };
      url = await getReviewImageUrl(imageDoc);
    } else if (!imgFile?.file && imgFile?.thumbnail) {
      const prevImgList = imgFile.thumbnail.map(
        (item, idx) => (item = String(idx))
      );
      const deletedPrevImgList = imgFile.thumbnail.filter(
        (item) => item.length == 1
      );
      const isDeletedFromPrevImg = deletedPrevImgList.length > 0;

      if (isDeletedFromPrevImg) {
        await Promise.all(
          deletedPrevImgList.map((item) => deleteImg(`${imgRef}/${item}`))
        );
      }

      url = await getImgUrlList(imgRef);
    } else if (!imgFile && existingReview?.img) {
      await deleteReviewImage(imgRef);
    }

    const newDoc = {
      id: id,
      phone: phone,
      storeName: storeName,
      address: address,
      x: x,
      y: y,
      stationList: stationList,
    };

    const review = {
      reviewID: reviewID,
      date: createdDate,
      user: {
        email: user?.email,
        displayName: user?.displayName,
        uid: user?.uid,
        photo: user?.photoURL,
      },
      flavor: flavor,
      richness: richness,
      text: text,
      rating: rating,
      image: url,
      comments: null,
      isRevised: isRevised,
    };
    reviewMutate({ prevRating, id, newDoc, reviewID, review });
    setModal(true);
  };

  return (
    <>
      <div className="mx-auto -translate-y-4 relative z-[9999]">
        <StoreSearch dispatch={setStore} />
      </div>
      <form onSubmit={onSubmit(handleSubmit)} className="flex flex-col">
        {store.storeName == "" ? (
          <p className="text-primary-dark-color text-sm font-semibold text-center">
            {" "}
            선택된 카페가 없습니다.
          </p>
        ) : (
          <div className="flex justify-center items-center text-sm ">
            <div className="inline-block w-1/3 text-center text-primary-dark-color font-semibold shrink-0 ml-5">
              {store.storeName}
            </div>
            <p className="w-2/3 indent-3 text-left">{store.address}</p>
          </div>
        )}

        <div className="flex justify-center items-center my-4 text-secondary-content text-sm font-semibold">
          <div className="inline-block  mr-2 ">평점 선택</div>
          <div className="rating flex items-center">
            {Array.from({ length: 6 }, (v, i) => (v = String(i))).map(
              (rate) => (
                <input
                  key={rate}
                  type="radio"
                  className="mask mask-star-2 bg-accent first:hidden"
                  value={String(rate)}
                  {...register("rating", { required: true })}
                />
              )
            )}
            <span className="ml-2">{rate}</span>
          </div>
        </div>
        <div className="max-w-[500px] mx-auto">
          <div className="flex items-center">
            <span>
              <i className="ico-coffeeBean text-xl px-2"></i>
            </span>
            {Object.entries(flavorList).map(([value, description]) => (
              <label
                key={value}
                className="label p-0 sm:p-3 cursor-pointer w-[130px] justify-start"
              >
                <input
                  type="radio"
                  value={value}
                  className="radio radio-sm mr-2 bg-white"
                  {...register("flavor", {
                    required: "옵션을 선택해주세요.",
                  })}
                />
                <span className=" text-xs">{description}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100">
            {errors?.flavor && (
              <>
                <MdError className="mr-1 mt-1" />
                <p>{errors.flavor.message}</p>
              </>
            )}
          </div>
          <div className="flex ">
            <span>
              <i className="ico-coffeeBean text-xl px-2"></i>
            </span>
            <div className="flex flex-wrap sm:flex-nowrap">
              {Object.entries(richnessList).map(([value, description]) => (
                <label
                  key={value}
                  className="label p-0 pb-2 text-[10px] sm:p-1 cursor-pointer w-[130px] sm:w-[150px] justify-start"
                >
                  <input
                    type="radio"
                    value={value}
                    className="radio radio-sm mr-2 bg-white"
                    {...register("richness", {
                      required: "옵션을 선택해주세요.",
                    })}
                  />
                  <span className="text-xs">{description}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100">
            {errors?.richness && (
              <>
                <MdError className="mr-1 mt-1" />
                <p>{errors.richness.message}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full max-w-lg text-sm mb-1 mx-auto">
          <textarea
            placeholder="리뷰를 입력해주세요 (10자 이상)"
            spellCheck={false}
            maxLength={150}
            required
            className="textarea textarea-bordered placeholder:text-xs bg-white textarea-xs w-full mt-1"
            {...register("text", {
              required: true,
              minLength: {
                value: 10,
                message: "10글자 이상 입력해주세요.",
              },
            })}
          />
          <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100">
            {errors?.text?.message && (
              <>
                <MdError className="mr-1 mt-1" />
                <p>{errors.text.message}</p>
              </>
            )}
          </div>
        </div>
        <div className="text-left indent-5 text-sm font-semibold mr-2 mb-2 ">
          사진을 첨부해주세요.{" "}
          <span className="text-xs font-normal">(선택 항목)</span>
        </div>
        <MultiImageUploader dispatch={setImgFile} img={imgFile} />
        <button
          role="button"
          onClick={() => reset()}
          className="text-xs font-semibold hover:bg-base-300 bg-base-200 px-4 py-2 mt-5 rounded-full mx-auto"
        >
          다시 작성하기
        </button>
        <button className="btn btn-neutral text-sub-color btn-wide rounded-full shadow-md no-animation my-5 block mx-auto">
          {existingReview ? "리뷰 수정" : "리뷰 등록"}
        </button>
        {modal && <InformModal loading={isLoading} inform={inform} />}
      </form>
    </>
  );
};

export default ReviewForm;
