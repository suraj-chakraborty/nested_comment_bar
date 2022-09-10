import { usePost } from "../contexts/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import comments from "../services/comments";

export function Post() {
  const { post, rootComments } = usePost();
  const { loading, error, execute: createCommentFn } = useAsyncFn(comments);
  function onCommentCreate(message) {
    return createCommentFn({ postId: post.id, message }).then((comment) => {
      console.log(comment);
    });
  }
  return (
    <>
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h2 className="Comment-Title">Comments</h2>
      <section>
        <CommentForm
          loading={loading}
          error={error}
          onSubmit={onCommentCreate}
        />
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </>
  );
}
