import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, updateComment } from "@/lib/firebase";
import { CommentProp, UpdateCommentProp } from "@/interface/review";

interface CommentInputProps {
  prevComment: {
    commentId: number;
    text: string;
  } | null;
  info: {
    storeId: string;
    reviewId: string;
  };
  inputEditor: Dispatch<SetStateAction<boolean>> | null;
}

interface CommentsForm {
  comment: string;
}

const CommentInput = ({
  prevComment,
  info,
  inputEditor,
}: CommentInputProps) => {
  const [user] = useAuthState(auth);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: onSubmit,
    reset,
  } = useForm<CommentsForm>({
    mode: "onSubmit",
    defaultValues: {
      comment: "",
    },
  });

  const { mutate: commentMutate } = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewInfo", info.storeId]);
    },
  });

  useEffect(() => {
    if (prevComment) {
      reset({
        comment: prevComment.text,
      });
    }
  }, [prevComment, reset]);

  const handleSubmit = (formData: CommentsForm) => {
    if (prevComment) {
      updateCommentDoc(formData);
    } else {
      createCommentDoc(formData);
    }
    reset();
  };

  const createCommentDoc = (formData: CommentsForm) => {
    if (!user) return;
    const { displayName, email, uid } = user;
    const { comment } = formData;
    const createdDate = `${new Date().toLocaleDateString(
      "en-US"
    )} ${new Date().toLocaleTimeString("en-GB")}`;
    const commentDoc: CommentProp = {
      text: comment,
      date: createdDate,
      commentId: Date.now(),
      userInfo: {
        displayName: displayName,
        email: email,
        uid: uid,
      },
      isRevised: false,
    };
    const document: UpdateCommentProp = {
      newDoc: commentDoc,
      storeId: info.storeId,
      reviewId: info.reviewId,
      commentId: null,
      newText: null,
    };
    commentMutate(document);
  };

  const updateCommentDoc = (formData: CommentsForm) => {
    if (!prevComment) return;
    const { comment } = formData;
    const document: UpdateCommentProp = {
      newDoc: null,
      storeId: info.storeId,
      reviewId: info.reviewId,
      commentId: prevComment.commentId,
      newText: comment,
    };
    commentMutate(document);
    if (inputEditor) {
      inputEditor(false);
    }
  };

  return (
    <>
      {user ? (
        <form onSubmit={onSubmit(handleSubmit)} className="w-full">
          <div className="flex justify-between my-0.5">
            <input
              type="text"
              placeholder={prevComment ? "" : "댓글 쓰기"}
              className="input input-bordered input-xs w-full focus:outline-none"
              maxLength={150}
              spellCheck={false}
              autoFocus={prevComment ? true : false}
              {...register("comment", {
                required: true,
              })}
            />
            {inputEditor ? (
              <button
                onClick={() => inputEditor(false)}
                type="button"
                className="btn btn-xs btn-ghost font-normal text-[11px] bg-base-200 hover:bg-base-300"
              >
                취소
              </button>
            ) : null}
            <button className="btn btn-xs btn-ghost font-normal text-[11px] bg-base-200 hover:bg-base-300">
              {prevComment ? "수정" : "등록"}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
};
export default CommentInput;
