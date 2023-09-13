import { usePathname } from "next/navigation";
import { IoIosShareAlt } from "react-icons/io";

const ShareButton = () => {
  const shareData = {
    title: "Java Time",
    text: "커피에 진심이신가요? Java Time에서 커피리뷰를 공유해보세요!",
    url: window.location.href,
  };

  const handleShare = async () => {
    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        throw new Error(
          `handleShare Error: Time(${new Date()}) ERROR ${error}`
        );
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };
  return (
    <button onClick={handleShare} className="btn btn-outline bg-white w-1/4 ">
      <IoIosShareAlt size={18} className="-mr-1" /> 공유
    </button>
  );
};

export default ShareButton;
