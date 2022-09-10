import { IconBtn } from "./IconButton";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { useState } from "react";
import "./component.css";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import comments from "../services/comments";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "long",
});

export function Comment({ id, message, user, createdAt }) {
  const { post, getReply, createLocalComment } = usePost();
  const createCommentFn = useAsyncFn(comments);
  const [isReplying, setIsReplying] = useState(false);

  function onCommentReply(message) {
    return createCommentFn
      .execute({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      });
  }

  const childComments = getReply(id);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        <div className="message">{message}</div>
        <div className="footer">
          <IconBtn Icon={FaHeart} aria-label="Like">
            2
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          <IconBtn Icon={FaEdit} aria-label="Edit" />

          <IconBtn Icon={FaTrash} aria-label="Delete" color="danger" />
        </div>
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested_comment_bar ${areChildrenHidden ? "hide" : ""}`}
          >
            <button className="btn" onClick={() => setAreChildrenHidden(true)}>
              Hide Comments
            </button>
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            show Comments
          </button>
        </>
      )}
    </>
  );
}
