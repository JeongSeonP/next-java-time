import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  increment,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  or,
} from "firebase/firestore";
import {
  CommentProp,
  ImageDoc,
  ReviewDocData,
  ReviewDocProp,
  ReviewDocumentData,
  ReviewImageDoc,
  UpdateCommentProp,
} from "@/interface/review";
import { UserDocProp, UserDocumentData } from "@/interface/user";
import Cookie from "js-cookie";
import { StoreDocumentData, StoreSearchDocumentData } from "@/interface/store";
import { DeleteOption } from "@/app/stores/[id]/Review";
import imageCompression from "browser-image-compression";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MSG_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MSMT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userCookie = Cookie.get("login");
    if (!userCookie) {
      Cookie.set("login", "true", { expires: 2 });
    }
  } else {
    Cookie.remove("login");
  }
});

export const setDocReview = async ({
  prevRating,
  id,
  newDoc,
  reviewID,
  review,
}: ReviewDocProp) => {
  const reviewRef = doc(db, "stores", id, "review", reviewID);
  const storeRef = doc(db, "stores", id);
  try {
    if (!prevRating) {
      await setDoc(storeRef, newDoc, { merge: true });
      await updateDoc(storeRef, {
        ttlRate: increment(Number(review.rating)),
        ttlParticipants: increment(1),
      });

      await setDoc(reviewRef, review, { merge: true });
    } else {
      const updatedRating = Number(review.rating) - Number(prevRating);
      await updateDoc(storeRef, {
        ttlRate: increment(updatedRating),
      });
      await updateDoc(reviewRef, {
        flavor: review.flavor,
        richness: review.richness,
        text: review.text,
        rating: review.rating,
        image: review.image,
        isRevised: review.isRevised,
      });
    }
  } catch (error) {
    throw new Error(`setDocReview Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const deleteReview = async ({
  storeId,
  reviewID,
  rating,
}: DeleteOption) => {
  const reviewRef = doc(db, "stores", storeId, "review", reviewID);
  const storeRef = doc(db, "stores", storeId);
  try {
    await deleteDoc(reviewRef);
    await updateDoc(storeRef, {
      ttlRate: increment(-Number(rating)),
      ttlParticipants: increment(-1),
    });
  } catch (error) {
    throw new Error(`deleteReview Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const updateComment = async ({
  newDoc,
  storeId,
  reviewId,
  commentId,
  newText,
}: UpdateCommentProp) => {
  const commentRef = doc(db, "stores", storeId, "review", reviewId);

  try {
    if (newDoc) {
      await updateDoc(commentRef, {
        comments: arrayUnion(newDoc),
      });
    } else {
      const docSnap = await getDoc(commentRef);
      if (docSnap.exists()) {
        const comment = docSnap.data().comments;
        const target = comment.find(
          (item: CommentProp) => item.commentId === commentId
        );
        await updateDoc(commentRef, {
          comments: arrayRemove(target),
        });
        if (newText) {
          const updatedText = { ...target, text: newText, isRevised: true };
          await updateDoc(commentRef, {
            comments: arrayUnion(updatedText),
          });
        }
      }
    }
  } catch (error) {
    throw new Error(`updateComment Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getReviewList = async (
  id: string | undefined,
  pageParam: number | string,
  filter: boolean,
  sort: string
) => {
  if (id === undefined || pageParam === null) return;
  const perPage = 5;
  const sortBy = sort === "최신순" ? "date" : "rating";

  try {
    if (pageParam == 0) {
      const qAll = query(
        collection(db, "stores", id, "review"),
        orderBy(sortBy, "desc"),
        limit(perPage + 1)
      );
      const qPhoto = query(
        collection(db, "stores", id, "review"),
        where("image", "!=", null),
        orderBy("image", "desc"),
        limit(perPage + 1)
      );
      const selectedQ = filter ? qPhoto : qAll;
      const snapShot = await getDocs(selectedQ);
      const reviewList = snapShot.docs.map((doc) =>
        doc.data()
      ) as ReviewDocData[];
      const lastDoc = snapShot.docs[perPage - 1];
      const nextPageParam = lastDoc ? lastDoc.data().reviewID : null;
      const hasNextPage = nextPageParam
        ? reviewList.length == perPage + 1
        : false;
      if (reviewList.length == perPage + 1) {
        reviewList.splice(perPage);
      }
      const result: ReviewDocumentData = {
        reviewList: reviewList,
        nextPageParam: nextPageParam,
        hasNextPage: hasNextPage,
      };
      return result;
    }

    if (pageParam != 0) {
      const startAfterRef = doc(db, "stores", id, "review", String(pageParam));
      const startAfterSnap = await getDoc(startAfterRef);

      if (startAfterSnap.exists()) {
        const nextQAll = query(
          collection(db, "stores", id, "review"),
          orderBy(sortBy, "desc"),
          startAfter(startAfterSnap),
          limit(perPage + 1)
        );

        const nextQPhoto = query(
          collection(db, "stores", id, "review"),
          where("image", "!=", null),
          orderBy("image", "desc"),
          startAfter(startAfterSnap),
          limit(perPage + 1)
        );
        const selectedQ = filter ? nextQPhoto : nextQAll;
        const nextSnapShot = await getDocs(selectedQ);
        const reviewList = nextSnapShot.docs.map((doc) =>
          doc.data()
        ) as ReviewDocData[];

        const lastDoc = nextSnapShot.docs[perPage - 1];
        const nextPageParam = lastDoc ? lastDoc.data().reviewID : null;
        const hasNextPage = nextPageParam
          ? reviewList.length == perPage + 1
          : false;

        if (reviewList.length === perPage + 1) {
          reviewList.splice(perPage);
        }
        const result: ReviewDocumentData = {
          reviewList: reviewList,
          nextPageParam: nextPageParam,
          hasNextPage: hasNextPage,
        };
        return result;
      }
    }
  } catch (error) {
    throw new Error(`getReviewList Error: Time(${new Date()}) ERROR ${error}`);
  }
};

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

export const setDocUser = async ({ uid, userDoc }: UserDocProp) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await setDoc(userRef, userDoc);
  } catch (error) {
    throw new Error(`setDocUser Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getDocUser = async (uid: string | undefined | null) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserDocumentData;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`getDocUser Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getReviewImageUrl = async ({ path, imgFile }: ReviewImageDoc) => {
  if (imgFile.length === 0) return null;
  try {
    const resizedList = await Promise.all(
      imgFile.map(async (img) => {
        const reSize = await imageCompression(img, { maxSizeMB: 0.5 });
        return reSize;
      })
    );

    if (!path) return;
    const imgRef = ref(storage, path);

    const uploadPromise = resizedList.map((blob, idx) => {
      const childRef = ref(imgRef, `/${idx}`);
      return uploadBytes(childRef, blob);
    });

    const urlList = await Promise.all(uploadPromise)
      .then(() => {
        return Promise.all(
          imgFile.map((_, idx) => getDownloadURL(ref(imgRef, `/${idx}`)))
        );
      })
      .then((downloadURLs) => downloadURLs);
    return urlList;
  } catch (error) {
    throw new Error(
      `getReviewImageUrl Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};

export const updateImg = async ({ refPath, imageFile }: ImageDoc) => {
  const imageRef = ref(storage, refPath);
  try {
    const resizedBlob = await imageCompression(imageFile, {
      maxSizeMB: 0.5,
    });
    await uploadBytes(imageRef, resizedBlob);
  } catch (error) {
    throw new Error(`updateImg Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const deleteImg = async (refPath: string) => {
  const imageRef = ref(storage, refPath);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    throw new Error(`deleteImg Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getImgUrl = async (refPath: string) => {
  const imageRef = ref(storage, refPath);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    throw new Error(`getImgUrl Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getThumbnailUrl = async (refPath: string) => {
  const listRef = ref(storage, refPath);
  try {
    const imgList = await list(listRef, { maxResults: 1 });
    if (imgList.items.length === 0) return;

    const url = await getDownloadURL(imgList.items[0]);
    return url;
  } catch (error) {
    throw new Error(
      `getThumbnailUrl Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};

//데이터구조
/**
- 컬렉션 -카페

—문서: 업체1,업체2 …

—데이터: 업체주소, 지도용 좌표, 총평점, 리뷰수, 리뷰, 근처지하철역 담은 배열

- (리뷰의 하위 컬렉션): 리뷰텍스트, 사진, 작성자, 작성날짜,댓글
 */

// -컬렉션 - 유저
// -문서: 유저1, 유저2...
// -데이터: uid, 커피취향
