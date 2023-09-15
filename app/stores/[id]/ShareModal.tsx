import { SHOW_MODAL_DELAY } from "@/constants/modalTime";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import Image from "next/image";
import kakaoLogo from "public/assets/kakaotalk_sharing_btn_medium.png";
import twitterLogo from "public/assets/4gUizsT__400x400.jpg";
import facebookLogo from "public/assets/facebook.png";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareDataProps {
  data: {
    readonly title: string;
    readonly text: string;
    readonly url: string;
  };
  toggle: Dispatch<SetStateAction<boolean>>;
}

const ShareModal = ({ data, toggle }: ShareDataProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js";
    script.integrity =
      "sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => script.remove();
  }, [data]);

  const handleLinkCopy = () => {
    navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), SHOW_MODAL_DELAY);
  };

  const handleKakaoShare = () => {
    if (window.Kakao == undefined) return;
    const kakao = window.Kakao;

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    }
    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: data.title,
        description: data.text,
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/javatime-6eaed.appspot.com/o/coffeeBeanWbg.jpg?alt=media&token=a80c31dd-91b1-4180-993a-a00b7c1475d5",
        link: {
          mobileWebUrl: data.url,
          webUrl: data.url,
        },
      },
    });
  };

  const handleShare = (sns: "twitter" | "facebook") => {
    if (sns == "twitter") {
      const shareLink =
        "text=" +
        encodeURIComponent(data.title + " \n ") +
        encodeURIComponent(data.url);
      window.open(
        `https://twitter.com/intent/tweet?${shareLink}`,
        "shareLink",
        "width=400, height=500"
      );
      return;
    }
    if (sns == "facebook") {
      const shareLink = encodeURIComponent(data.url);
      window.open(
        `http://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
        "shareLink",
        "width=400, height=500"
      );
      return;
    }
  };
  return (
    <div className="z-[9999] fixed top-0 right-0 bottom-0 left-0">
      <div className="absolute w-10/12 max-w-lg   top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 card bg-base-100  ">
        <div className="flex items-center justify-center card-body bg-[#f2e8f7] rounded-md text-xs h-48 font-semibold text-center shadow-lg">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex gap-4 mb-5">
              <button onClick={handleKakaoShare} className="w-10 h-10 relative">
                <Image
                  src={kakaoLogo}
                  fill
                  sizes="40px"
                  alt="카카오공유버튼"
                  className="object-cover"
                />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="w-10 h-10 relative rounded-lg overflow-hidden"
              >
                <Image
                  src={facebookLogo}
                  fill
                  sizes="40px"
                  alt="페이스북공유버튼"
                  className="object-cover"
                />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="w-10 h-10 relative rounded-lg overflow-hidden"
              >
                <Image
                  src={twitterLogo}
                  fill
                  sizes="40px"
                  alt="트위터공유버튼"
                  className="object-cover"
                />
              </button>
            </div>
            <div className="w-full relative">
              <input
                type="text"
                value={data.url}
                readOnly
                className="w-full rounded-full px-2 pr-14 h-10 bg-zinc-100 border border-gray-300 truncate"
              />
              <button
                onClick={handleLinkCopy}
                className="absolute right-1 top-1 w-11 h-8 btn btn-neutral btn-xs text-xs"
              >
                {copied ? (
                  <BsCheckLg size={19} className="font-bold" />
                ) : (
                  "복사"
                )}
              </button>
            </div>
          </div>
          <button
            onClick={() => toggle(false)}
            className="btn btn-xs btn-circle flex items-center justify-center absolute right-2 top-2"
          >
            <span className="-mt-0.5">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
