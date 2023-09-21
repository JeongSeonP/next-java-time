import { UserDocProp, UserDocumentData } from "@/interface/user";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "./firebaseInit";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ImageDoc } from "@/interface/review";
import imageCompression from "browser-image-compression";

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
  const imgRef = ref(storage, refPath);
  try {
    await deleteObject(imgRef);
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
