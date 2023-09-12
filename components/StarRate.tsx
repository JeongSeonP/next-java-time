import { BsStarFill } from "react-icons/bs";

interface Props {
  rate: string;
}

const StarRate = ({ rate }: Props) => {
  const starWidth = 16;
  return (
    <div className="relative ml-1 w-[84px] h-[18px] ">
      <div className="absolute ">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <BsStarFill
              key={i}
              className="inline-block text-neutral-300"
              size="16"
            />
          ))}
      </div>
      <div
        className="absolute  overflow-hidden whitespace-nowrap"
        style={{
          width: `${Number(rate) * starWidth}px`,
        }}
      >
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <BsStarFill
              key={i}
              className="inline-block text-accent"
              size="16"
            />
          ))}
      </div>
    </div>
  );
};
export default StarRate;
