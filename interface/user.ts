import { FlavorCode, TypeCode } from "@/constants/selectOptions";
import { DocumentData } from "firebase/firestore";

export interface UserDocProp {
  uid: string;
  userDoc: UserDoc;
}

export interface UserDoc {
  favoriteFlavor: string;
  favoriteType: string;
  isPublic: boolean;
}

export interface UserDocumentData extends DocumentData {
  favoriteFlavor: FlavorCode;
  favoriteType: TypeCode;
  isPublic: boolean;
}
