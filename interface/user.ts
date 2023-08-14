export interface UserDocProp {
  uid: string;
  userDoc: UserDoc;
}

export interface UserDoc {
  favoriteFlavor: string;
  favoriteType: string;
  isPublic: boolean;
}
