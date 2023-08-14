"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/Io";
import { FcGoogle } from "react-icons/Fc";
import { MdError } from "react-icons/Md";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const LoginForm = () => {
  const loginSchema = Yup.object({
    email: Yup.string().required("이메일을 입력해주세요."),
    password: Yup.string().required("비밀번호를 입력해주세요."),
  });
  type LoginFormData = Yup.InferType<typeof loginSchema>;
  const {
    register,
    formState: { errors },
    handleSubmit: onSubmit,
    setValue,
    setFocus,
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const emailInput = watch("email");
  const passwordInput = watch("password");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, GoogleUser, GoogleLoading, GoogleError] =
    useSignInWithGoogle(auth);
  const pathname = usePathname();
  const redirectedFrom = pathname !== "/login" ? pathname : "/";
  useEffect(() => {
    if (user || GoogleUser) {
      router.replace(redirectedFrom);
    }

    if (!error && !GoogleError) return;
    const errorCode = error ? error.code : GoogleError?.code;

    switch (errorCode) {
      case "auth/user-not-found":
        setErrorMsg("가입되지 않은 사용자입니다.");
        setFocus("email");
        break;
      case "auth/wrong-password":
        setErrorMsg("비밀번호가 올바르지 않습니다.");
        setFocus("password");
        break;
    }
  }, [user, error, GoogleUser, GoogleError, setFocus, router, redirectedFrom]);

  useEffect(() => {
    const errorMessage = errors.email?.message
      ? errors.email?.message
      : errors.password?.message;
    if (!errorMessage) return;
    setErrorMsg(errorMessage);
  }, [errors]);

  const handleLogin = (formData: LoginFormData) => {
    signInWithEmailAndPassword(formData.email, formData.password);
  };

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  return (
    <>
      <form onSubmit={onSubmit(handleLogin)}>
        <div className="relative mb-2">
          <label htmlFor="email" className="sr-only">
            이메일
          </label>
          <input
            type="email"
            id="email"
            placeholder="E-MAIL"
            className="placeholder:text-xs input w-full max-w-xs bg-[#fff] input-bordered input-primary rounded-[15px]  "
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
        <div className="relative mb-2">
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            placeholder="PASSWORD"
            className="placeholder:text-xs input w-full max-w-xs bg-[#fff] input-bordered input-primary rounded-[15px]"
            {...register("password")}
          />
          {passwordInput !== "" ? (
            <button
              type="button"
              onClick={() => setValue("password", "")}
              className="w-3 h-3 border  rounded-full  flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
            >
              <IoIosClose />
            </button>
          ) : null}
        </div>
        <div className="flex justify-end items-center text-error text-right text-[11px] h-5">
          {errorMsg && (
            <>
              <MdError className="mr-1" />
              <p>{errorMsg}</p>
            </>
          )}
        </div>
        <button className="btn text-sub-color bg-neutral/90 hover:bg-neutral w-full rounded-full shadow-md no-animation my-2">
          로그인
        </button>
      </form>
      <div className="divider my-1 text-xs">OR</div>
      <button
        onClick={handleGoogleLogin}
        className="relative btn btn-neutral text-sub-color w-full rounded-full shadow-md no-animation my-2"
      >
        <FcGoogle size="18" className="absolute left-12" />
        구글 로그인
      </button>
    </>
  );
};

export default LoginForm;
