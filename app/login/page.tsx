import LoginForm from "@/app/login/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="py-20">
      <article className="w-80 mx-auto text-center">
        <LoginForm />
        <div className="text-right">
          <Link
            href={"/join"}
            className="link link-primary mx-6 text-[13px] text-primary-dark-color"
          >
            회원가입
          </Link>
        </div>
      </article>
    </main>
  );
};

export default LoginPage;
