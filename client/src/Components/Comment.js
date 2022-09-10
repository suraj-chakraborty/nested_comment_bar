import { IconBtn } from "./IconButton";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { useState } from "react";
import "./component.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "long",
});

export function Comment({ id, message, user, createdAt }) {
  const { getReply } = usePost();
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
          <IconBtn Icon={FaReply} aria-label="Reply" />
          <IconBtn Icon={FaEdit} aria-label="Edit" />

          <IconBtn Icon={FaTrash} aria-label="Delete" color="danger" />
        </div>
      </div>
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested_comment_bar ${areChildrenHidden ? "hide" : ""}`}
          >
            <div
              className="nested-comments"
              onClick={() => setAreChildrenHidden(true)}
            >
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
