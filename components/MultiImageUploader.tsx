import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/Md";
import { IoClose } from "react-icons/io5";
import InformModal from "./InformModal";
import { SHOW_MODAL_DELAY } from "@/constants/modalTime";

export interface MultiImagefile {
  file: File[] | null;
  thumbnail: string[];
  name: string;
}

interface Props {
  dispatch: Dispatch<SetStateAction<MultiImagefile | null>>;
  img: MultiImagefile | null;
}

const MultiImageUploader = ({ dispatch, img }: Props) => {
  const [modal, setModal] = useState(false);
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length > 3) {
      setModal(true);
      setTimeout(() => {
        setModal(false);
      }, SHOW_MODAL_DELAY);
      return;
    }
    const imgList = Array.from(e.target.files);
    const thumbnailList = imgList.map((img) => URL.createObjectURL(img));

    dispatch({
      file: imgList,
      thumbnail: thumbnailList,
      name: "업로드할 이미지",
    });

    e.target.value = "";
  };

  const handleDeleteImg = (id: number) => {
    const filteredFile = img?.file?.filter((_, index) => index !== id);
    const filteredThumbnail = img?.thumbnail.filter((_, index) => index !== id);

    if (filteredFile?.length == 0) {
      dispatch(null);
    } else if (filteredFile && filteredThumbnail) {
      dispatch({
        file: filteredFile,
        thumbnail: filteredThumbnail,
        name: "업로드할 이미지",
      });
    }
  };

  return (
    <>
      <div className="w-full max-w-sm flex justify-center items-center  text-sm font-semibold mx-auto">
        <div className="flex items-center w-80 bg-white rounded-lg shadow">
          <label
            htmlFor="multiImageInput"
            className="w-16 h-24 text-xs mr-1 text-secondary-content bg-primary/40 rounded-l-lg shadow flex flex-col items-center justify-center cursor-pointer"
          >
            <MdAddPhotoAlternate
              size={22}
              className="text-primary-dark-color"
            />

            <p>{img ? img.thumbnail.length : 0}/3</p>
          </label>
          <div className="grow flex">
            {img?.thumbnail.map((item, id) => (
              <div
                key={id}
                className="w-20 h-20 mr-1 flex justify-center items-center rounded-lg shadow bg-white overflow-hidden relative z-10"
              >
                <Image
                  src={item}
                  fill
                  sizes="144px"
                  alt={img.name}
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImg(id)}
                  className="w-5 h-5 border rounded-full text-primary flex justify-center items-center bg-white hover:bg-primary hover:text-base-100 absolute top-1 right-1"
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        id="multiImageInput"
        onChange={handleImage}
        className="hidden"
        multiple
      />
      {modal && (
        <InformModal
          loading={false}
          inform={"사진은 3장이내로 선택할 수 있습니다."}
        />
      )}
    </>
  );
};

export default MultiImageUploader;
