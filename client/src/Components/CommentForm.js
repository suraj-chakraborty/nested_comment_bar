import React, { useState } from "react";

const CommentForm = ({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "",
}) => {
  const [message, setMessage] = useState(initialValue);
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(""));
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          value={message}
          autoFocus={autoFocus}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button className="btn" type="submit" disable={loading}>
          {loading ? "Loading..." : "Post"}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  );
};

export default CommentForm;
