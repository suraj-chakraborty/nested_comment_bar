import React, { useContext, useEffect, useMemo, useState } from "react";
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

  const [comments, setComments] = useState([]);
  const commentsByParentId = useMemo(() => {
    if (comments == null) return [];
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);
  // console.log(
  //   "🚀 ~ file: PostContext.js ~ line 23 ~ commentsByParentId ~ commentsByParentId",
  //   commentsByParentId
  // );

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  function createLocalComment(comment) {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  }
  function updateLocalComment(id, message) {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  }

  function getReply(parentId) {
    return commentsByParentId[parentId];
  }

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        getReply,
        rootComments: commentsByParentId[null],
        createLocalComment,
        updateLocalComment,
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
