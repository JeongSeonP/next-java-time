import { favoriteFlavor, favoriteType } from "@/constants/selectOptions";
import { UserData, UserDocumentData } from "@/interface/user";
import { getDocUser } from "@/lib/firebase/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { BsCheckCircleFill, BsFillPersonFill } from "react-icons/bs";

interface ProfileModalProps {
  user: UserData;
  toggle: Dispatch<SetStateAction<UserData | null>>;
}

const ProfileModal = ({ user, toggle }: ProfileModalProps) => {
  const { data: userDoc } = useQuery<UserDocumentData | null | undefined>(
    ["user", user.uid],
    () => getDocUser(user.uid)
  );
  return (
    <>
      <div
        onClick={() => toggle(null)}
        className={`modal z-[99999] bg-transparent
          visible opacity-100 pointer-events-auto `}
      >
        <div className="modal-box bg-[#f2e8f7] text-center py-8">
          <label
            onClick={() => toggle(null)}
            className="btn btn-xs btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="font-bold text-lg mb-4">
            <span> {user.displayName ?? user.email}</span>
            <span> 님</span>{" "}
          </div>{" "}
          <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-[#fff] text-primary shadow-lg">
            {user?.photo ? (
              <Image
                src={user.photo}
                fill
                sizes="112px"
                alt="프로필이미지"
                className="object-cover"
              />
            ) : (
              <BsFillPersonFill size="112" className="mt-2" />
            )}
          </div>
          {!userDoc ? (
            <p className="mt-4 py-4 text-sm">작성된 프로필이 없습니다.</p>
          ) : userDoc?.isPublic ? (
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
