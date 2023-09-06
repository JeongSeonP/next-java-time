import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

const ImageModal = ({
  imgList,
  toggle,
}: {
  imgList: string[];
  toggle: Dispatch<SetStateAction<string[] | false | null>>;
}) => {
  return (
    <div
      onClick={() => toggle(false)}
      className="z-[9999] fixed top-0 right-0 bottom-0 left-0 bg-neutral/40"
    >
      <div className=" flex relative w-4/5 h-3/5 top-1/2 -translate-y-1/2   bg-white rounded-lg shadow mx-auto">
        <div className="flex relative w-full bg-blue-50 cursor-pointer">
          {imgList.map((image, idx) => (
            <Image
              key={idx}
              src={image}
              alt="리뷰이미지"
              fill
              sizes="80vw"
              className="object-contain cursor-pointer"
            />
          ))}
        </div>
        <div className="absolute w-full flex justify-end ">
          <IoClose
            size={24}
            className="text-sub-color m-3 mr-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
