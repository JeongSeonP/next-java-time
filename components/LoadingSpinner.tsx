import { CgSpinner } from "react-icons/cg";

const LoadingSpinner = () => {
  return (
    <div className="animate-spin">
      <CgSpinner className="text-neutral-content text-4xl" />
    </div>
  );
};

export default LoadingSpinner;
