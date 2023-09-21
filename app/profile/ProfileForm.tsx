"use client";

import ImageUploader, { Imagefile } from "@/components/ImageUploader";
import InformModal from "@/components/InformModal";
import { SHOW_MODAL_DELAY } from "@/constants/modalTime";
import { favoriteFlavor, favoriteType } from "@/constants/selectOptions";
import { auth } from "@/lib/firebase/firebaseInit";
import {
  deleteImg,
  getDocUser,
  getImgUrl,
  setDocUser,
  updateImg,
} from "@/lib/firebase/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

interface ProfileForm {
  displayName: string | null;
  flavor: string;
  type: string;
  isPublic: boolean;
}

const ProfileForm = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const existingPhotoURL = useRef(false);
  const [imgFile, setImgFile] = useState<Imagefile | null>(null);
  const [updateProfile, updating] = useUpdateProfile(auth);
  const { data: userDoc } = useQuery(["user", user?.uid], () =>
    getDocUser(user?.uid)
  );
  const [initialValue, setInitialValue] = useState({
    displayName: "",
    flavor: "",
    type: "",
    isPublic: true,
  });
  const { mutate: userMutate, isLoading } = useMutation(setDocUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user?.uid]);
      setTimeout(() => {
        router.push("/mypage");
      }, SHOW_MODAL_DELAY);
    },
  });
  const {
    register,
    handleSubmit: onSubmit,
    reset,
    watch,
  } = useForm<ProfileForm>({
    mode: "onSubmit",
    defaultValues: initialValue,
  });
  const isPublic = watch("isPublic");

  useEffect(() => {
    if (userDoc || user) {
      reset({
        displayName: user?.displayName ?? "",
        flavor: userDoc?.favoriteFlavor ?? "",
        type: userDoc?.favoriteType ?? "",
        isPublic: userDoc?.isPublic ?? true,
      });
    }
    if (user?.photoURL) {
      existingPhotoURL.current = true;
      setImgFile({
        file: null,
        thumbnail: user.photoURL,
        name: "existingPhoto",
      });
    }
  }, [user, userDoc, reset]);

  const handleSubmit = async (formData: ProfileForm) => {
    if (!user) return;
    const { uid } = user;
    const { displayName, flavor, type, isPublic } = formData;
    const userDoc = {
      favoriteFlavor: flavor,
      favoriteType: type,
      isPublic: isPublic,
    };

    if (imgFile?.file) {
      const imageDoc = {
        refPath: `user/${uid}`,
        imageFile: imgFile?.file,
      };
      await updateImg(imageDoc);
      const photoURL = await getImgUrl(imageDoc.refPath);
      await updateProfile({ displayName, photoURL });
    } else if (!imgFile && existingPhotoURL) {
      await deleteImg(`user/${uid}`);
      await updateProfile({ displayName, photoURL: "" });
    }
    userMutate({ uid, userDoc });
    setModal(true);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)} className="flex flex-col">
      <div className="flex justify-center items-center">
        <label
          htmlFor="nickname"
          className="block w-24 text-left font-semibold text-sm"
        >
          닉네임{" "}
        </label>
        <input
          type="text"
          id="nickname"
          maxLength={10}
          spellCheck={false}
          placeholder="닉네임은 10자 이내로 지어주세요."
          className="placeholder:text-xs input w-3/5 max-w-xs input-bordered input-primary bg-[#fff] rounded-xl "
          {...register("displayName", {
            required: true,
          })}
        />
      </div>
      <div className="max-w-[500px] w-full mx-auto mt-4 text-sm">
        <div className="text-left  font-semibold mr-2 my-4">
          자신의 커피취향을 선택해보세요.
        </div>
        <div className="flex flex-col justify-center">
          <div className="inline-block w-20 font-semibold text-left text-xs">
            원두
          </div>
          <div className="flex justify-center items-center">
            {Object.entries(favoriteFlavor).map(([value, description]) => (
              <label
                key={value}
                className="label cursor-pointer w-1/2 justify-center"
              >
                <input
                  type="radio"
                  className="radio radio-sm mr-2 bg-white"
                  value={value}
                  {...register("flavor", {
                    required: true,
                  })}
                />
                <span className="label-text text-xs">{description}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="inline-block w-20 font-semibold text-xs text-left md:mr-10 ">
            커피종류
          </div>
          <div className="flex justify-center items-center">
            {Object.entries(favoriteType).map(([value, description]) => (
              <label
                key={value}
                className="label cursor-pointer w-1/3 justify-center"
              >
                <input
                  type="radio"
                  className="radio radio-sm mr-2 bg-white"
                  value={value}
                  {...register("type", {
                    required: true,
                  })}
                />
                <span className="label-text text-xs">{description}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[500px] w-full mx-auto my-4 text-sm">
        <div className="text-left font-semibold mr-2 my-4">
          프로필 사진을 등록해보세요.
          <span className="text-xs font-normal ml-2">(선택 항목)</span>
        </div>
        <ImageUploader dispatch={setImgFile} img={imgFile} />
      </div>
      <div className="form-control w-40 mx-auto">
        <label className="label cursor-pointer">
          <span className="label-text font-semibold text-sm">
            {isPublic ? "프로필 공개" : "프로필 미공개"}
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            defaultChecked
            {...register("isPublic")}
          />
        </label>
      </div>
      <button className="btn btn-neutral text-sub-color btn-wide rounded-full shadow-md no-animation my-8 block mx-auto">
        프로필 등록
      </button>
      {modal && (
        <InformModal
          loading={updating || isLoading}
          inform={"프로필이 등록되었습니다!"}
        />
      )}
    </form>
  );
};

export default ProfileForm;
