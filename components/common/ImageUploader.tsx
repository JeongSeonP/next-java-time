import { Dispatch, SetStateAction } from "react";

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
  };

  return (
    <>
      <div className="flex justify-center items-center text-sm font-semibold">
        <label
          htmlFor="imageInput"
          className="w-20 text-xs text-primary-dark-color bg-primary/40 hover:bg-primary/70 h-36 rounded-l-lg shadow flex flex-col items-center justify-center"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
            </svg>
          </div>
          <p>찾아보기</p>
        </label>
        <div className="w-36 h-36 z-[888] flex justify-center items-center rounded-r-lg shadow bg-[#fff] overflow-hidden relative">
          {img ? (
            <img src={img.thumbnail} alt={img.name} className="inline-block" />
          ) : (
            <div className="text-xs font-thin text-neutral-400">
              <p>선택된 사진이</p>
              <p>없습니다.</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => dispatch(null)}
            className="w-5 h-5 border rounded-full text-primary flex justify-center items-center bg-[#fff] hover:bg-primary hover:text-base-100 absolute top-1 right-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
