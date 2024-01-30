import { DocumentData } from "firebase/firestore";

export interface SelectedStore {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  x: string;
  y: string;
}
export interface StoreDoc extends SelectedStore {
  stationList: string[];
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
  nextPageParam: string;
  hasNextPage: boolean;
}
