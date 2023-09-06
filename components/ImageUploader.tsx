import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

export interface Imagefile {
  file: File | null;
  thumbnail: string;
  name: string;
}

interface Props {
  dispatch: Dispatch<SetStateAction<Imagefile | null>>;
  img: Imagefile | null;
}

const ImageUploader = ({ dispatch, img }: Props) => {
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      const url = URL.createObjectURL(fileList[0]);
      dispatch({
        file: fileList[0],
        thumbnail: url,
        name: fileList[0].name,
      });
    }
    e.target.value = "";
  };

  return (
    <>
      <div className="flex justify-center items-center  text-sm font-semibold">
        <label
          htmlFor="imageInput"
          className="w-20 text-xs text-primary-dark-color bg-primary/40 hover:bg-primary/70 h-36 rounded-l-lg shadow flex flex-col items-center justify-center"
        >
          <div>
            <HiMiniPhoto size={18} />
          </div>
          <p>찾아보기</p>
        </label>
        <div className="w-36 h-36 flex justify-center items-center rounded-r-lg shadow bg-white overflow-hidden relative z-10">
          {img ? (
            <Image
              src={img.thumbnail}
              fill
              sizes="144px"
              alt={img.name}
              className="object-cover"
            />
          ) : (
            <div className="text-xs font-thin text-neutral-400">
              <p>선택된 사진이</p>
              <p>없습니다.</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => dispatch(null)}
            className="w-5 h-5 border rounded-full text-primary flex justify-center items-center bg-white hover:bg-primary hover:text-base-100 absolute top-1 right-1"
          >
            <IoClose />
          </button>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        id="imageInput"
        onChange={handleImage}
        className="hidden"
      />
    </>
  );
};

export default ImageUploader;
