import { CgSpinner } from "react-icons/Cg";

const Loading = () => {
  return (
    <main className="pt-10 pb-20">
      <div className=" flex flex-col items-center justify-center mt-40">
        <div className="animate-spin">
          <CgSpinner className="text-neutral-content text-4xl" />
        </div>
      </div>
    </main>
  );
};
export default Loading;
