import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from "../../services/api";
import { AiFillDelete, AiFillEdit, AiFillStop } from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import "./CommentSection.css";
import { toast } from "react-toastify";

function CommentSection({ comicId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [commentId, setCommentId] = useState(null);
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
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("O texto do comentario está vacío.");
      return;}

    try {
      if (isEditing) {
        await updateComment(commentId, newComment);
        setIsEditing(false);
        setCommentId(null);
        toast.success("Comentario editado");
      } else {
        await addComment(comicId, newComment);
        toast.success("Comentario engadido");
      }
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleEditComment = (comment) => {
    setIsEditing(true);
    setNewComment(comment.comment_text);

    setCommentId(comment._id);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewComment("");
    setCommentId(null);
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, user._id);
      toast.success("Comentario eliminado");
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
          {isEditing && commentId === comment._id ? (
            <form className="add-comment-form edit-comment-form" onSubmit={handleAddComment}>
              <div className="input-with-icon">
                <TextareaAutosize
                  className="comment-textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                 <div className="comment-actions">
                <button  type="button" onClick={handleCancelEdit} className="delete-edit-icon">
                  <AiFillStop />
                </button>
                <button type="submit" className="delete-edit-icon">
                  <FaPaperPlane />
                </button></div>
              </div>
            </form>
          ) : (
            <>
              <p>{comment.comment_text}</p>
              <small>
                Por: {comment.username} o{" "}
                {new Date(comment.created_at).toLocaleDateString()}
              </small>
              {user && user.username === comment.username && (
                <div className="comment-actions">
                  <button
                    className="delete-edit-icon"
                    onClick={() => handleEditComment(comment)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="delete-edit-icon"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              )}{" "}
            </>
          )}
        </div>
      ))}

      {user && !isEditing && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <div className="input-with-icon">
            <TextareaAutosize
              className="comment-textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Engade un comentario..."
            />
            <button
              type="submit"
              className="send-icon-button"
              title="Enviar comentario"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CommentSection;
