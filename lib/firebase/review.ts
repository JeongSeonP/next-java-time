import { DeleteOption } from "@/app/stores/[id]/Review";
import {
  CommentProp,
  ReviewDocData,
  ReviewDocProp,
  ReviewDocumentData,
  ReviewImageDoc,
  UpdateCommentProp,
} from "@/interface/review";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebaseInit";
import imageCompression from "browser-image-compression";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";

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
    }
  } catch (error) {
    throw new Error(`getReviewList Error: Time(${new Date()}) ERROR ${error}`);
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
        const urls = getImgUrlList(path);
        return urls;
      })
      .then((downloadURLs) => downloadURLs);

    return urlList;
  } catch (error) {
    throw new Error(
      `getReviewImageUrl Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};

export const getImgUrlList = async (refPath: string) => {
  const listRef = ref(storage, refPath);
  try {
    const imgList = await listAll(listRef);
    if (imgList.items.length == 0) return;

    const urlList = await Promise.all(
      imgList.items.map((item) => getDownloadURL(item))
    ).then((downloadURLs) => downloadURLs);
    return urlList;
  } catch (error) {
    throw new Error(`getImgUrlList Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const deleteReviewImage = async (refPath: string) => {
  const listRef = ref(storage, refPath);
  try {
    const imgList = await listAll(listRef);
    if (imgList.items.length == 0) return;
    imgList.items.forEach(async (item) => await deleteObject(item));
  } catch (error) {
    throw new Error(
      `deleteReviewImage Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};
