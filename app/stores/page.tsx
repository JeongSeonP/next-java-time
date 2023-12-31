import StorePageSearch from "./StorePageSearch";

export const metadata = {
  title: "리뷰검색",
};

const StoresPage = () => {
  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center">
        <div className="flex flex-col justify-center items-center">
          <StorePageSearch />
        </div>
      </div>
    </main>
  );
};

export default StoresPage;
