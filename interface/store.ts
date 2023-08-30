import { DocumentData } from "firebase/firestore";

export interface StoreDoc {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  stationList: string[];
  x: string;
  y: string;
}

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

export interface StoreSearchDocumentData extends DocumentData {
  storeList: string[];
  nextPage: string;
  hasNextPage: boolean;
}
