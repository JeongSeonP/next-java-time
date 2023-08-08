"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth } from "@/lib/firebase";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/Io";
import { FcGoogle } from "react-icons/Fc";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

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
    clearErrors,
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });
  const emailInput = watch("email");
  const passwordInput = watch("password");

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // const location = useLocation();
  // const redirectedFrom = location?.state?.redirectedFrom?.pathname || "/";
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, GGuser, GGloading, GGerror] =
    useSignInWithGoogle(auth);

  // useEffect(() => {
  //   if (user || GGuser) {
  //     localStorage.setItem("isLogin", "true");
  //     // setEmail("");
  //     // setPassword("");
  //     // router.push(redirectedFrom);
  //   }

  //   if (error || GGerror) {
  //     let errorCode;
  //     if (error) {
  //       errorCode = error.code;
  //     } else if (GGerror) {
  //       errorCode = GGerror.code;
  //     }

  //     switch (errorCode) {
  //       case "auth/user-not-found":
  //         setErrorMsg("가입되지 않은 사용자입니다.");
  //         setEmail("");
  //         setPassword("");
  //         emailRef.current?.focus();
  //         break;
  //       case "auth/invalid-email":
  //         setErrorMsg("EMAIL주소를 입력해주세요.");
  //         setEmail("");
  //         setPassword("");
  //         emailRef.current?.focus();
  //         break;
  //       case "auth/wrong-password":
  //         setErrorMsg("PASSWORD가 올바르지 않습니다.");
  //         setPassword("");
  //         passwordRef.current?.focus();
  //         break;
  //       case "auth/missing-password":
  //         setErrorMsg("PASSWORD를 입력해주세요.");
  //         setPassword("");
  //         passwordRef.current?.focus();
  //         break;
  //     }
  //   }
  // }, [user, error, GGuser, GGerror]);

  const handleLogin: SubmitHandler<FieldValues> = async (
    formData: FieldValues
  ) => {
    // setErrorMsg("");

    const res = await signInWithEmailAndPassword(emailInput, passwordInput);
    return res;
  };

  const handleGGLogin = async () => {
    const res = await signInWithGoogle();
    return res;
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
          {emailInput === "" ? null : (
            <button
              type="button"
              onClick={() => setValue("email", "")}
              className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
            >
              <IoIosClose />
            </button>
          )}
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
          {passwordInput === "" ? null : (
            <button
              type="button"
              onClick={() => setValue("password", "")}
              className="w-3 h-3 border  rounded-full  flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
            >
              <IoIosClose />
            </button>
          )}
        </div>
        <p className="text-error text-right text-xs h-5">{errorMsg}</p>
        <button className="btn text-sub-color bg-neutral/90 hover:bg-neutral w-full rounded-full shadow-md no-animation my-2">
          로그인
        </button>
      </form>
      <div className="divider my-1 text-xs">OR</div>
      <button
        onClick={handleGGLogin}
        className="relative btn btn-neutral text-sub-color w-full rounded-full shadow-md no-animation my-2"
      >
        <FcGoogle size="18" className="absolute left-12" />
        구글 로그인
      </button>
      <div className="text-right">
        <button
          onClick={() => router.push("/join")}
          className="link link-primary mx-6 text-[13px] text-primary-dark-color"
        >
          회원가입
        </button>
      </div>
    </>
  );
};

export default LoginForm;
