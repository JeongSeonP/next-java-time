"use client";

import { getMostPopularStores } from "@/lib/firebase/store";
import TableItem from "./TableItem";
import { useQuery } from "@tanstack/react-query";

const Table = () => {
  const { data: storeDoc } = useQuery(["storeInfo"], getMostPopularStores);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
        {storeDoc?.map((store, idx) => (
          <TableItem key={store.id} store={store} idx={idx} />
        ))}
      </div>
    </>
  );
};
export default Table;
