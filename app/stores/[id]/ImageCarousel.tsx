import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ imgList }: { imgList: string[] }) => {
  return (
    <div className=" flex justify-center items-center max-w-md mx-auto">
      <Carousel
        useKeyboardArrows
        showThumbs={false}
        showStatus={false}
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          return (
            <i
              className={`ico-coffeeBean mr-2 text-[10px] ${
                isSelected ? `text-white` : `text-white/40`
              } `}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
            />
          );
        }}
      >
        {imgList.map((img, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden ">
            <Image src={img} alt="리뷰이미지" width={300} height={300} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
