import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoIosShareAlt } from "react-icons/io";
import ShareModal from "./ShareModal";

const ShareButton = ({ storeName }: { storeName: string | undefined }) => {
  const [shareModal, setShareModal] = useState(false);
  const pathname = usePathname();
  const baseUrl = "https://next-java-time.vercel.app";
  const shareData = {
    title: "Java Time",
    text: `Java Time | ${storeName} - 리뷰페이지`,
    url: `${baseUrl}${pathname}`,
  };

  const handleShare = async () => {
    // const isWebShareAPISupported = !navigator.canShare ? false : true;

    // if (isWebShareAPISupported && navigator.canShare(shareData)) {
    //   try {
    //     await navigator.share(shareData);
    //   } catch (error) {
    //     throw new Error(
    //       `handleShare Error: Time(${new Date()}) ERROR ${error}`
    //     );
    //   }
    // } else if (navigator.clipboard) {
    //   // navigator.clipboard.writeText(shareData.url);
    //   setShareModal(true);
    // }

    setShareModal(true);
  };
  return (
    <div className="w-1/4 ">
      <button
        onClick={handleShare}
        className="btn btn-outline bg-white w-full "
      >
        <IoIosShareAlt size={18} className="-mr-1" /> 공유
      </button>
      {shareModal ? (
        <ShareModal data={shareData} toggle={setShareModal} />
      ) : null}
    </div>
  );
};

export default ShareButton;
