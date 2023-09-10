import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import ImageCarousel from "./ImageCarousel";

const ImageModal = ({
  imgList,
  toggle,
}: {
  imgList: string[];
  toggle: Dispatch<SetStateAction<string[] | false | null>>;
}) => {
  return (
    <div className="z-[9999] fixed top-0 right-0 bottom-0 left-0 bg-neutral/40">
      <div className=" flex relative w-4/5 h-4/5 top-1/2 -translate-y-1/2   bg-white rounded-lg shadow mx-auto overflow-hidden">
        <ImageCarousel imgList={imgList} />
        <div className="absolute w-full flex justify-end ">
          <IoClose
            onClick={() => toggle(false)}
            size={28}
            className="text-neutral m-3 mr-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
