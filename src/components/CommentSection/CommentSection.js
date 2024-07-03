import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getComments, addComment, deleteComment } from "../../services/api";
import { AiFillDelete } from "react-icons/ai";

import "./CommentSection.css";

function CommentSection({ comicId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(comicId);
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [comicId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    if (e.type === "keypress" && e.key !== "Enter") return;
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(comicId, user._id, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, user._id);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comentarios</h3>
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p>{comment.comment_text}</p>
          <small>
            Por: {comment.username} el{" "}
            {new Date(comment.created_at).toLocaleDateString()}
          </small>
          {user && user.username === comment.username && (
            <button className="delete-comment" onClick={() => handleDeleteComment(comment._id)}>
               <AiFillDelete />
            </button>
          )}
        </div>
      ))}
      {user && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleAddComment}
            placeholder="Engade un comentario..."
          ></textarea>
          {/* <button type="submit">Comentar</button> */}
        </form>
      )}
    </div>
  );
}

export default CommentSection;
