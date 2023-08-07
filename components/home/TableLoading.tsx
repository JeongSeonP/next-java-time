const TableLoading = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse w-full h-[304px] bg-[#f1efef] card shadow-xl"
            />
          ))}
      </div>
    </>
  );
};
export default TableLoading;
