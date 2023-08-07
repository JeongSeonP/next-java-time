"use client";

// import { useQuery } from "react-query";
// import { getMostPopularStores, storage } from "../api/firebase";
import { useEffect, useState } from "react";
// import { getDownloadURL, list, ref } from "firebase/storage";
import { DocumentData } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
import TableItem from "./TableItem";
import TableLoading from "./TableLoading";

export interface StoreDocumentData extends DocumentData {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  stationList: string[];
  x: string;
  y: string;
  ttlParticipants: number;
  ttlRate: number;
}

const Table = () => {
  // const {
  //   data: storeDoc,
  //   isLoading,
  //   error,
  // } = useQuery(["storeInfo"], getMostPopularStores);

  // if (isLoading) {
  //   return <TableLoading />;
  // }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
        {/* {storeDoc?.map((store) => (
          <TableItem key={store.id} store={store} />
        ))} */}
      </div>
    </>
  );
};
export default Table;
