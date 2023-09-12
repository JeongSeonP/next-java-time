"use client";
import { auth, getDocUser } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { BsCheckCircleFill, BsFillPersonFill } from "react-icons/bs";
import { favoriteFlavor, favoriteType } from "@/constants/selectOptions";

const MyPage = () => {
  const [user] = useAuthState(auth);
  const { data: userDoc } = useQuery(["user", user?.uid], () =>
    getDocUser(user?.uid)
  );
  const router = useRouter();
  return (
    <main className="py-16">
      <div className="mx-auto text-center font-semibold">
        <article className="flex-col justify-center mx-auto md:max-w-3xl py-3 px-4 rounded-3xl border border-base-200 shadow text-base-dark-color">
          <h2 className="flex justify-center items-center -translate-y-9 mx-auto w-40  h-10  font-semibold rounded-full shadow bg-base-100 text-base-dark-color ">
            마이 페이지
          </h2>
          <h3 className="text-sm mb-8">
            <span className="text-primary-focus mr-2">
              {user?.displayName ?? user?.email}
            </span>
            님의 프로필
          </h3>

          <div className="max-w-[500px] mx-auto mt-4 ">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden bg-white text-primary shadow-lg">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  fill
                  sizes="160px"
                  alt="프로필이미지"
                  className="object-cover"
                />
              ) : (
                <BsFillPersonFill size="160" className="mt-2" />
              )}
            </div>
            {userDoc ? (
              <>
                <div className="font-semibold mr-2 mt-6">
                  <p>
                    <i className="ico-coffeeBean mr-1"></i>나의 커피취향
                  </p>
                  <div className="flex justify-center items-center p-4 text-center">
                    <div className="flex justify-center items-center mr-7">
                      <BsCheckCircleFill className="text-primary mr-2" />
                      <p className="font-normal">
                        {favoriteFlavor[userDoc.favoriteFlavor]}
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <BsCheckCircleFill className="text-primary mr-2" />
                      <p className="font-normal">
                        {favoriteType[userDoc.favoriteType]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divider my-1"></div>
                <div className="font-semibold mr-2 my-6 mb-10">
                  <p>
                    <i className="ico-coffeeBean mr-1"></i>프로필 공개여부
                  </p>
                  <div className="flex justify-center items-center p-4 ">
                    <BsCheckCircleFill className="text-primary mr-2" />
                    <p className="font-normal">
                      {userDoc.isPublic ? "공개" : "비공개"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="font-semibold mr-2 my-6 mb-10">
                <p>프로필 등록하고 나의 커피취향을 공유해보세요.</p>
                <p>가고싶은 카페를 찾는데 도움이 될거에요!</p>
              </div>
            )}
          </div>

          <button
            role="button"
            onClick={() => router.push("/profile")}
            className="text-sm font-semibold hover:bg-base-300 bg-base-200 p-3 px-5 mt-1 rounded-full"
          >
            프로필 수정하기
          </button>
        </article>
      </div>
    </main>
  );
};
export default MyPage;
