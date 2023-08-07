import { BiUpArrowAlt } from "react-icons/bi";

const Topbtn = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <>
      <button
        onClick={scrollToTop}
        className="md:fixed absolute w-10 h-10 rounded-full shadow-md md:bottom-5 md:right-10 bottom-[250px] translate-x-1/2 right-1/2 bg-[#fff] "
      >
        <BiUpArrowAlt className="text-base-300" size="20" />
      </button>
    </>
  );
};
export default Topbtn;
