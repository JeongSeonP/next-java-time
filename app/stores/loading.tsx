const Loading = () => {
  return (
    <main className="pt-7 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <div className="animate-pulse w-40 h-12 mb-3 bg-[#f1efef] rounded-full"></div>
        <div className=" flex flex-col md:flex-row items-center justify-between w-full max-w-xl">
          <div className="flex items-center justify-around md:justify-between mb-2 w-[350px] md:grow">
            <div className=" w-[130px] h-[130px] md:w-[150px] md:h-[150px]  bg-[#f1efef] mr-2 rounded-xl"></div>
            <div className="grow bg-[#f1efef]  h-[130px] md:h-[150px] ml-1 rounded-xl md:ml-4"></div>
          </div>
          <div className="md:w-[150px] md:h-[150px] w-[350px] h-[120px] mb-2 bg-[#f1efef] ml-1 rounded-xl md:ml-4"></div>
        </div>
      </div>
    </main>
  );
};

export default Loading;
