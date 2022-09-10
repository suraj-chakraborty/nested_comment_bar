import React from "react";
import { makeRequest } from "./makeRequest";

const comments = ({ postId, message, parentId }) => {
  return makeRequest(`/posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
};

export default comments;
