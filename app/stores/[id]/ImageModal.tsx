import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const ImageModal = ({
  src,
  toggle,
}: {
  src: string;
  toggle: Dispatch<SetStateAction<string | false | null>>;
}) => {
  return (
    <div
      onClick={() => toggle(false)}
      className="z-[9999] fixed top-0 right-0 bottom-0 left-0 bg-neutral/40"
    >
      <div className="relative  w-4/5 h-3/5 top-1/2 -translate-y-1/2  overflow-hidden bg-white rounded-lg shadow mx-auto">
        <Image
          src={src}
          alt="리뷰이미지"
          fill
          sizes="80vw"
          className="object-contain cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageModal;
