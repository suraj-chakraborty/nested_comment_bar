import { Comment } from "./Comment";
import "./component.css";

export function CommentList({ comments }) {
  return comments.map((comment) => (
    <div key={comment.id} className="comments">
      <Comment {...comment} />
    </div>
  ));
}
