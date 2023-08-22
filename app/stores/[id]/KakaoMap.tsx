import { DocumentData } from "firebase/firestore";
import { useEffect, useRef } from "react";
declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({ info }: DocumentData) => {
  const container = useRef(null);
  const overlayContainer = useRef(null);
  const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const href = `http://place.map.kakao.com/${info.id}`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JAVASCRIPT_KEY}&autoload=false`;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const kakaoMap = window.kakao.maps;
        const position = new kakaoMap.LatLng(Number(info.y), Number(info.x));
        const options = {
          center: position,
          level: 5,
        };
        const map = new kakaoMap.Map(container.current, options);

        const imageSrc =
            "https://firebasestorage.googleapis.com/v0/b/javatime-6eaed.appspot.com/o/marker.png?alt=media&token=34e5c33a-f534-4177-b5a3-b37b1b5c1241",
          imageSize = new kakaoMap.Size(40, 35),
          imageOption = { offset: new kakaoMap.Point(20, 13) };

        const markerImage = new kakaoMap.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
        const marker = new kakaoMap.Marker({
          position: options.center,
          image: markerImage,
        });
        marker.setMap(map);

        new kakaoMap.CustomOverlay({
          position: position,
          map: map,
          content: overlayContainer.current,
          yAnchor: 1.5,
        });
      });
    };
    return () => script.remove();
  }, [container, info]);

  return (
    <div className="rounded-xl shadow-md overflow-hidden mb-2">
      <div ref={overlayContainer} className="relative inline-block z-[999]">
        <div className="flex items-center text-base-100 w-fit py-1 px-3 h-5 rounded-md bg-[#291334] hover:text-[#dfaff7] transition-transform duration-100 ease-in-out  text-xs  after:content-['']  after:absolute after:left-[50%] after:rotate-45 after:-translate-x-2/4 after:-bottom-1 after:w-2 after:h-2 after:border-b-4 after:border-r-4 after:border-[#291334] shadow-[1px_2px_2px_0px_#fff] after:shadow-[1px_1px_1px_0px_#fff]">
          <a
            href={href}
            className=" "
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="inline-block w-full text-center">
              {info.storeName}
            </span>
          </a>
        </div>
      </div>

      <div
        className="md:w-[150px] md:h-[150px] w-[350px] h-[120px]"
        id="container"
        ref={container}
      />
    </div>
  );
};

export default KakaoMap;
