import { ReactNode } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";

interface Props {
  children: ReactNode;
}

const Dropdown = (props: Props) => {
  const handleFocus = () => {
    const element = document.activeElement;
    if (element) {
      (element as HTMLElement).blur();
    }
  };

  return (
    <div className="dropdown dropdown-end ml-1">
      <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle avatar">
        <button className="btn btn-square btn-ghost border border-base-300 btn-xs ">
          <BiDotsVerticalRounded size="18" />
        </button>
      </label>
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-fit"
        onClick={handleFocus}
      >
        {props.children}
      </ul>
    </div>
  );
};

export default Dropdown;
