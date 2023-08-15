export interface ReviewDoc {
  reviewID: string;
  date: string;
  user: {
    email: string | null | undefined;
    displayName: string | null | undefined;
    uid: string | undefined;
    photo: string | null | undefined;
  };
  flavor: string;
  richness: string;
  text: string;
  rating: string;
  image: string | null;
  comments: CommentProp[] | null;
  isRevised: boolean;
}
export interface ReviewDocData {
  reviewID: string;
  date: string;
  user: {
    email: string;
    displayName: string | null;
    uid: string;
    photo: string | null | undefined;
  };
  flavor: FlavorCode;
  richness: RichnessCode;
  text: string;
  rating: string;
  image: string | null;
  comments: CommentProp[] | null;
  isRevised: boolean;
}

export interface ReviewDocProp {
  prevRating: string | null;
  id: string;
  newDoc: StoreDoc;
  reviewID: string;
  review: ReviewDoc;
}

export interface UpdateCommentProp {
  newDoc: CommentProp | null;
  storeId: string;
  reviewId: string;
  commentId: number | null;
  newText: string | null;
}

export interface CommentProp {
  text: string;
  date: string;
  commentId: number;
  userInfo: {
    displayName: string | null;
    email: string | null;
    uid: string;
  };
  isRevised: boolean;
}