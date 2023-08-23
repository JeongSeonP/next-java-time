import { BsFillCheckCircleFill } from "react-icons/Bs";
import { CgSpinner } from "react-icons/Cg";

interface InformModalProps {
  loading: boolean;
  inform: string;
}
const InformModal = ({ loading, inform }: InformModalProps) => {
  return (
    <div className="z-[9999] fixed top-0 right-0 bottom-0 left-0">
      <div className="absolute w-[300px] rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 card bg-base-100  shadow-xl">
        <div className="flex items-center justify-center card-body bg-[#f2e8f7] text-xs sm:text-sm h-36 font-semibold text-center ">
          {loading ? (
            <div className="animate-spin">
              <CgSpinner className="ico-coffeeBean text-neutral-content text-4xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <BsFillCheckCircleFill
                size="22"
                className="text-base-100 mb-3 -mt-5"
              />
              <p>{inform}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default InformModal;
