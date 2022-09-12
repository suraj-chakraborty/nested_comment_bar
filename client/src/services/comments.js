import { makeRequest } from "./makeRequest";

export function Comments({ postId, message, parentId }) {
  return makeRequest(`/posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
}

export function UpdateComments({ postId, message, id }) {
  return makeRequest(`/posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { message },
  });
}
export function DeleteComments({ postId, id }) {
  return makeRequest(`/posts/${postId}/comments/${id}`, {
    method: "delete",
  });
}

export function ToggleLike({ id, postId }) {
  return makeRequest(`/posts/${postId}/comments/${id}/toggleLike`, {
    method: "POST",
  });
}
