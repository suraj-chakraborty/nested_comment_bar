import React, { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
const Context = React.createContext();

export function usePost() {
  return useContext(Context);
}

export function PostProvider({ children }) {
  const { id } = useParams();
  const { loading, error, data: post } = useAsync(() => getPost(id), [id]);

  const commentsByParentId = useMemo(() => {
    if (post?.comments == null) return [];
    const group = {};
    post.comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [post?.comments]);
  // console.log(
  //   "🚀 ~ file: PostContext.js ~ line 23 ~ commentsByParentId ~ commentsByParentId",
  //   commentsByParentId
  // );

  function getReply(parentId) {
    return commentsByParentId[parentId];
  }

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        getReply,
        rootComments: commentsByParentId[null],
      }}
    >
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1 className="error">{error}</h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
