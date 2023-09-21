"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { SHOW_MODAL_DELAY } from "@/constants/modalTime";
import { MdError } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import InformModal from "@/components/InformModal";
import { auth } from "@/lib/firebase/firebaseInit";

const JoinForm = () => {
  const joinSchema = Yup.object({
    displayName: Yup.string()
      .max(10, "닉네임은 10자 이내로 입력해주세요.")
      .required("닉네임을 입력해주세요."),
    email: Yup.string().required("이메일을 입력해주세요."),
    password: Yup.string()
      .min(6, "비밀번호는 최소 6자 이상 입력해주세요.")
      .required("비밀번호를 입력해주세요."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
      .required("비밀번호를 입력해주세요."),
  });
  type JoinFormData = Yup.InferType<typeof joinSchema>;
  const {
    register,
    formState: { errors },
    handleSubmit: onSubmit,
    setValue,
    setFocus,
    watch,
  } = useForm<JoinFormData>({
    resolver: yupResolver(joinSchema),
    mode: "onSubmit",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const displayNameInput = watch("displayName");
  const emailInput = watch("email");
  const passwordInput = watch("password");
  const cfmPasswordInput = watch("confirmPassword");
  const [errorMsg, setErrorMsg] = useState("");
  const [modal, setModal] = useState(false);

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile] = useUpdateProfile(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setTimeout(() => router.push("/"), SHOW_MODAL_DELAY);
    }
    if (error) {
      setModal(false);
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMsg("이미 가입된 email주소입니다.");
          setFocus("email");
          break;
        case "auth/invalid-email":
          setErrorMsg("잘못된 형식의 email주소입니다.");
          setFocus("email");
          break;
        case "auth/weak-password":
          setErrorMsg("PASSWORD는 최소 6자 이상이어야 합니다.");
          setFocus("password");
          break;
      }
    }
  }, [user, error, router, setFocus]);

  const handleJoin = async (formData: JoinFormData) => {
    setModal(true);
    await createUserWithEmailAndPassword(formData.email, formData.password);
    await updateProfile({ displayName: formData.displayName });
  };

  return (
    <>
      <form onSubmit={onSubmit(handleJoin)}>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-0.5">
          <label
            htmlFor="registeredNickname"
            className="block w-full pl-2 pb-2 sm:w-24 text-left font-semibold text-xs"
          >
            닉네임
          </label>
          <div className="flex flex-col w-full max-w-xs">
            <div className="relative">
              <input
                type="text"
                id="registeredDisplayName"
                maxLength={11}
                placeholder="닉네임은 10자 이내로 입력해주세요."
                className="placeholder:text-xs bg-white input w-full input-bordered input-primary rounded-lg  "
                {...register("displayName")}
              />
              {displayNameInput !== "" ? (
                <button
                  type="button"
                  onClick={() => setValue("displayName", "")}
                  className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
                >
                  <IoIosClose />
                </button>
              ) : null}
            </div>
            <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100 mt-1">
              {errors.displayName?.message && (
                <>
                  <MdError className="mr-1 mt-1" />
                  <p>{errors.displayName.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-0.5">
          <label
            htmlFor="registeredEmail"
            className="block w-full pl-2 pb-2 sm:w-24 text-left font-semibold text-xs"
          >
            이메일
          </label>
          <div className="flex flex-col w-full max-w-xs">
            <div className="relative">
              <input
                type="email"
                id="registeredEmail"
                placeholder="example@example.com"
                className="placeholder:text-xs bg-white input w-full input-bordered input-primary rounded-lg  "
                {...register("email")}
              />
              {emailInput !== "" ? (
                <button
                  type="button"
                  onClick={() => setValue("email", "")}
                  className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
                >
                  <IoIosClose />
                </button>
              ) : null}
            </div>
            <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100 mt-1">
              {errors.email?.message && (
                <>
                  <MdError className="mr-1 mt-1" />
                  <p>{errors.email.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-0.5">
          <label
            htmlFor="registeredPW"
            className="block w-full pl-2 pb-2 sm:w-24 text-left font-semibold text-xs"
          >
            비밀번호
          </label>
          <div className="flex flex-col w-full max-w-xs">
            <div className="relative">
              <input
                type="password"
                id="registeredPW"
                placeholder="비밀번호는 6자 이상 입력해주세요."
                className="placeholder:text-xs bg-white input w-full input-bordered input-primary rounded-lg "
                {...register("password")}
              />
              {passwordInput !== "" ? (
                <button
                  type="button"
                  onClick={() => setValue("password", "")}
                  className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
                >
                  <IoIosClose />
                </button>
              ) : null}
            </div>
            <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100 mt-1">
              {errors.password?.message && (
                <>
                  <MdError className="mr-1 mt-1" />
                  <p>{errors.password.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-0.5">
          <label
            htmlFor="confirmPW"
            className="block w-full pl-2 pb-2 sm:w-24 text-left font-semibold text-xs "
          >
            비밀번호 확인
          </label>
          <div className="flex flex-col w-full max-w-xs">
            <div className="relative">
              <input
                type="password"
                id="confirmPW"
                placeholder="비밀번호를 다시한번 입력해주세요."
                className="placeholder:text-xs bg-white input w-full  input-bordered input-primary rounded-lg "
                {...register("confirmPassword")}
              />
              {cfmPasswordInput !== "" ? (
                <button
                  type="button"
                  onClick={() => setValue("confirmPassword", "")}
                  className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
                >
                  <IoIosClose />
                </button>
              ) : null}
            </div>
            <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100 mt-1">
              {errors.confirmPassword?.message && (
                <>
                  <MdError className="mr-1 mt-1" />
                  <p>{errors.confirmPassword.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end text-[11px] h-4 w-full font-light text-error bg-base-100 mt-1">
          {errorMsg && (
            <>
              <MdError className="mr-1 mt-1" />
              <p>{errorMsg}</p>
            </>
          )}
        </div>
        <button className="btn btn-neutral text-sub-color btn-wide rounded-full shadow-md no-animation my-8 block mx-auto">
          가입하기
        </button>
      </form>
      {modal && (
        <InformModal loading={loading} inform={"회원가입이 완료되었습니다!"} />
      )}
    </>
  );
};

export default JoinForm;
