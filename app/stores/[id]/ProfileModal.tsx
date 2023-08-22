import { favoriteFlavor, favoriteType } from "@/constants/selectOptions";
import { UserDocumentData } from "@/interface/user";
import { getDocUser } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { BsCheckCircleFill } from "react-icons/Bs";

interface UserData {
  email: string;
  displayName: string | null;
  uid: string;
  photo: string | null | undefined;
}

interface ProfileModalProps {
  user: UserData;
}

const ProfileModal = ({ user }: ProfileModalProps) => {
  const [toggle, setToggle] = useState(false);
  const { data: userDoc } = useQuery<UserDocumentData | undefined>(
    ["user", user.uid],
    () => getDocUser(user.uid)
  );

  return (
    <>
      <div
        onClick={() => setToggle(true)}
        className="text-[#744959] font-semibold  hover:bg-base-200 cursor-pointer rounded-full py-1 px-3"
      >
        {user.displayName ?? user.email}
      </div>
      <div>{user.uid}</div>
      <div
        onClick={() => setToggle(false)}
        className={`modal z-[99999] bg-transparent"
          ${toggle ? "visible opacity-100 pointer-events-auto " : ""}`}
      >
        <div className="modal-box bg-[#f2e8f7] text-center py-8">
          <label
            onClick={() => setToggle(false)}
            className="btn btn-xs btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="font-bold text-lg mb-2">
            <span> {user.displayName ?? user.email}</span>
            <span> 님</span>{" "}
          </div>{" "}
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-[#fff] text-primary shadow-lg">
            {user?.photo ? (
              <Image
                src={user.photo}
                width={112}
                height={112}
                alt="프로필이미지"
              />
            ) : (
              <svg
                className="w-28 mt-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            )}
          </div>
          {userDoc?.isPublic ? (
            <div className="font-semibold mr-2 mt-6 text-sm">
              <p>
                <i className="ico-coffeeBean mr-1"></i>나의 커피취향은?
              </p>
              <div className="flex justify-center items-center p-4 text-center">
                <div className="flex justify-center items-center mr-7">
                  <BsCheckCircleFill className="text-[#fff] mr-2" />
                  <p className="font-normal">
                    {favoriteFlavor[userDoc.favoriteFlavor]}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <BsCheckCircleFill className="text-[#fff] mr-2" />
                  <p className="font-normal">
                    {favoriteType[userDoc.favoriteType]}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 py-4 text-sm">프로필이 공개되지 않았습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
