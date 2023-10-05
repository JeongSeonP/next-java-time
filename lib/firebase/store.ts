import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebaseInit";
import { StoreDocumentData, StoreSearchDocumentData } from "@/interface/store";
import { getDownloadURL, list, ref } from "firebase/storage";

export const getDocStore = async (id: string | undefined) => {
  if (id === undefined) return;
  const storeRef = doc(db, "stores", id);
  try {
    const docSnap = await getDoc(storeRef);
    if (docSnap.exists()) {
      return docSnap.data() as StoreDocumentData;
    }
  } catch (error) {
    throw new Error(`getDocStore Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getMostPopularStores = async () => {
  const q = query(
    collection(db, "stores"),
    orderBy("ttlParticipants", "desc"),
    limit(6)
  );
  try {
    const docSnap = await getDocs(q);
    const storeList = docSnap.docs.map((doc) =>
      doc.data()
    ) as StoreDocumentData[];
    return storeList;
  } catch (error) {
    throw new Error(
      `getMostPopularStores Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};

export const findStore = async (
  pageParam: number | string,
  searchInput: string | null
) => {
  if (!searchInput) return;

  const perPage = 5;
  let searchForStation = searchInput;
  const lastWord = searchForStation[searchForStation.length - 1];
  if (lastWord !== "역") {
    searchForStation += "역";
  }
  try {
    if (pageParam == 0) {
      const q = query(
        collection(db, "stores"),
        or(
          where("storeName", "==", searchInput),
          where("stationList", "array-contains", searchForStation)
        ),
        orderBy("ttlParticipants", "desc"),
        limit(perPage + 1)
      );

      const snapShot = await getDocs(q);
      const storeList = snapShot.docs.map((doc) => doc.data().id);
      const lastDoc = snapShot.docs[perPage - 1];
      const nextPageParam = lastDoc ? lastDoc.data().id : null;
      const hasNextPage = nextPageParam
        ? storeList.length == perPage + 1
        : false;

      if (storeList.length == perPage + 1) {
        storeList.splice(perPage);
      }

      const result: StoreSearchDocumentData = {
        storeList,
        nextPageParam,
        hasNextPage,
      };
      return result;
    }

    if (pageParam != 0) {
      const startAfterRef = doc(db, "stores", String(pageParam));
      const startAfterSnap = await getDoc(startAfterRef);

      if (startAfterSnap.exists()) {
        const nextQ = query(
          collection(db, "stores"),
          or(
            where("storeName", "==", searchInput),
            where("stationList", "array-contains", searchForStation)
          ),
          orderBy("ttlParticipants", "desc"),
          startAfter(startAfterSnap),
          limit(perPage + 1)
        );

        const snapShot = await getDocs(nextQ);
        const storeList = snapShot.docs.map((doc) => doc.data().id);
        const lastDoc = snapShot.docs[perPage - 1];
        const nextPageParam = lastDoc ? lastDoc.data().id : null;
        const hasNextPage = nextPageParam
          ? storeList.length == perPage + 1
          : false;

        if (storeList.length == perPage + 1) {
          storeList.splice(perPage);
        }

        const result: StoreSearchDocumentData = {
          storeList,
          nextPageParam,
          hasNextPage,
        };
        return result;
      }
    }
  } catch (error) {
    throw new Error(`findStore Error: Time(${new Date()}) ERROR ${error}`);
  }
};
export const getThumbnailUrl = async (refPath: string) => {
  const listRef = ref(storage, refPath);
  try {
    const imgList = await list(listRef, { maxResults: 1 });
    if (imgList.prefixes.length == 0 && imgList.items.length == 0) return null;
    if (imgList.prefixes[0] == undefined) {
      const url = await getDownloadURL(imgList.items[0]);
      return url;
    }
    const test = await list(imgList.prefixes[0], { maxResults: 1 });
    const url = await getDownloadURL(test.items[0]);
    return url;
  } catch (error) {
    throw new Error(
      `getThumbnailUrl Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};
