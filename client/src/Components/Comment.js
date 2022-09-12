import { IconBtn } from "./IconButton";
import {
  FaEdit,
  FaHeart,
  FaRegBell,
  FaRegHeart,
  FaReply,
  FaTrash,
} from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { useState } from "react";
import "./component.css";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import {
  Comments,
  DeleteComments,
  ToggleLike,
  UpdateComments,
} from "../services/comments";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "long",
});

export function Comment({
  id,
  message,
  user,
  createdAt,
  LikeCount,
  likedByMe,
}) {
  const {
    post,
    getReply,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();

  // creating comment on the server  🍩it has a loading and error state
  const createCommentFn = useAsyncFn(Comments);
  const [isReplying, setIsReplying] = useState(false);

  const UpdateCommentFn = useAsyncFn(UpdateComments);
  const [isEditing, setIsEditing] = useState(false);

  const deleteCommentFn = useAsyncFn(DeleteComments);

  const toggleCommentLikeFn = useAsyncFn(ToggleLike);

  function onCommentReply(message) {
    return createCommentFn
      .execute({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      });
  }
  function onCommentUpdate(message) {
    return UpdateCommentFn.execute({ postId: post.id, message, id }).then(
      (comment) => {
        setIsEditing(false);

        updateLocalComment(id, comment.message);
      }
    );
  }
  function onCommentDelete() {
    return deleteCommentFn
      .execute({ postId: post.id, id })
      .then((comment) => deleteLocalComment(comment.id));
  }

  function onToggleCommentLike() {
    return toggleCommentLikeFn
      .execute({ id, postId: post.id })
      .then(({ addLike }) => toggleLocalCommentLike(id, addLike));
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
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={UpdateCommentFn.loading}
            error={UpdateCommentFn.error}
          />
        ) : (
          <div className="message">{message}</div>
        )}

        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "unlike" : "Like"}
          >
            {LikeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          <IconBtn
            onClick={() => setIsEditing((prev) => !prev)}
            isActive={isEditing}
            Icon={FaEdit}
            aria-label={isEditing ? "Cancel Edit" : "Edit"}
          />

          <IconBtn
            disable={deleteCommentFn.loading}
            onClick={onCommentDelete}
            Icon={FaTrash}
            aria-label="Delete"
            color="danger"
          />
        </div>
        {deleteCommentFn.error && (
          <div className="error">{deleteCommentFn.error}</div>
        )}
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
