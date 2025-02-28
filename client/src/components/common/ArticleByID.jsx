import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import "./ArticleByID.css";

function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  function enableEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...currentArticle, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    articleAfterChanges.dateOfModification = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    try {
      const res = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "article modified") {
        setEditArticleStatus(false);
        setCurrentArticle(res.data.payload);
        navigate(`/author-profile/articles/${currentArticle.articleId}`, {
          state: res.data.payload,
        });
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  }
  async function addComment(commentObj) {
    try {
        const token = await getToken();
        if (!token) {
            setCommentStatus("Authentication error. Please log in again.");
            return;
        }

        // Retrieve user details from localStorage
        const storedUser = localStorage.getItem("currentuser");
        if (!storedUser) {
            setCommentStatus("Error: User not found. Please log in again.");
            return;
        }

        const currentUser = JSON.parse(storedUser); // Convert from string to object

        // Validate required fields
        if (!commentObj.comment || commentObj.comment.trim() === "") {
            setCommentStatus("Error: Comment cannot be empty.");
            return;
        }

        // Create payload based on schema
        const payload = {
            nameOfUser: currentUser.firstName, // Ensure this exists in localStorage
            comment: commentObj.comment.trim()
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        const res = await axios.put(
            `http://localhost:3000/user-api/comment/${currentArticle.articleId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Comment response:", res.data);

        if (res.data.message === "comment added") {
            setCommentStatus("Comment added successfully");
            setShowCommentForm(false);
            setCurrentArticle(res.data.payload || {
                ...currentArticle,
                comments: [...(currentArticle.comments || []), payload]
            });
            reset();
        } else {
            setCommentStatus("Comment submitted successfully.");
        }
    } catch (error) {
        console.error("Error adding comment:", error);

        if (error.response) {
            console.error("Response data:", error.response.data);
            setCommentStatus(`Error: ${error.response.data.message || "Invalid data format."}`);
        } else if (error.request) {
            setCommentStatus("Network error: No response from server.");
        } else {
            setCommentStatus(`Error: ${error.message}`);
        }
    }
}


  async function deleteArticle() {
    try {
      const token = await getToken({ template: "long_lived_token" });
      if (!token) {
        console.error("No token available");
        return;
      }
      
      const updatedState = { ...currentArticle, isArticleActive: false };
      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${currentArticle.articleId}`,
        updatedState,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }

  async function restoreArticle() {
    try {
      const token = await getToken({ template: "long_lived_token" });
      if (!token) {
        console.error("No token available");
        return;
      }
      
      const updatedState = { ...currentArticle, isArticleActive: true };
      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${currentArticle.articleId}`,
        updatedState,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error("Error restoring article:", error);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Unknown date";
    
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const categoryColors = {
    'programming': '#6366F1', // Indigo
    'AI&ML': '#3B82F6',       // Blue
    'database': '#10B981'     // Emerald
  };

  return (
    <div className="container my-5">
      {editArticleStatus === false ? (
        <>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="article-card">
                {/* Article Header */}
                <div className="article-header">
                  {/* Category Badge */}
                  <div 
                    className="category-badge"
                    style={{ backgroundColor: categoryColors[currentArticle.category] || '#6c757d' }}
                  >
                    {currentArticle.category}
                  </div>
                  
                  <h1 className="article-title">{currentArticle.title}</h1>
                  
                  <div className="author-info">
                    <img
                      src={currentArticle.authorData.profileImageUrl}
                      className="author-image"
                      alt={currentArticle.authorData.nameOfAuthor}
                    />
                    <div>
                      <h5 className="author-name">{currentArticle.authorData.nameOfAuthor}</h5>
                      <div className="date-info">
                        <span>Published: {(currentArticle.dateOfCreation)}</span>
                        {currentArticle.dateOfModification && currentArticle.dateOfModification !== currentArticle.dateOfCreation && (
                          <span className="ms-3">Updated: {(currentArticle.dateOfModification)}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Author Actions - Moved to right side */}
                    {currentUser.role === "author" && (
                      <div className="author-actions">
                        <button 
                          className="action-button"
                          onClick={enableEdit}
                          title="Edit Article"
                        >
                          <FaEdit size={18} className="text-primary" />
                        </button>
                        
                        {currentArticle.isArticleActive ? (
                          <button
                            className="action-button"
                            onClick={deleteArticle}
                            title="Delete Article"
                          >
                            <MdDelete size={20} className="text-danger" />
                          </button>
                        ) : (
                          <button
                            className="action-button"
                            onClick={restoreArticle}
                            title="Restore Article"
                          >
                            <MdRestore size={20} className="text-success" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Article Content - Optimized for Reading */}
                  <div className="article-content">
                    {currentArticle.content}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="comments-section">
                <div className="comments-padding">
                  <h3 className="comments-title">
                    Comments {currentArticle.comments && currentArticle.comments.length > 0 && `(${currentArticle.comments.length})`}
                  </h3>
                  
                  {/* Comment List */}
                  <div className="mb-4">
                    {!currentArticle.comments || currentArticle.comments.length === 0 ? (
                      <div className="no-comments">
                        <p className="no-comments-text">No comments yet</p>
                        {currentUser.role === "user" && (
                          <button 
                            className="comment-button"
                            onClick={() => setShowCommentForm(true)}
                          >
                            Be the first to comment
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {currentArticle.comments.map((commentObj) => (
                          <div key={commentObj._id} className="comment-card">
                            <div className="comment-card-body">
                              <div className="comment-header">
                                <div className="comment-avatar">
                                  {commentObj.nameOfUser?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h6 className="comment-author">{commentObj.nameOfUser}</h6>
                                  {commentObj.dateAdded && (
                                    <small className="comment-date">{commentObj.dateAdded}</small>
                                  )}
                                </div>
                              </div>
                              <p className="comment-text">{commentObj.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Add Comment Form */}
                  {commentStatus && (
                    <div className="success-alert" role="alert">
                      {commentStatus}
                    </div>
                  )}
                  
                  {currentUser && currentUser.role === "user" && (
                    <>
                      {!showCommentForm && (currentArticle.comments && currentArticle.comments.length > 0) && (
                        <button 
                          className="comment-button"
                          onClick={() => setShowCommentForm(true)}
                        >
                          Add a comment
                        </button>
                      )}
                      
                      {showCommentForm && (
                        <form onSubmit={handleSubmit(addComment)} className="comment-form">
                          <div className="comment-form-body">
                            <textarea
                              rows="3"
                              placeholder="Share your thoughts..."
                              {...register("comment", { required: true })}
                              className="comment-textarea"
                            ></textarea>
                            <div className="comment-form-actions">
                              <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => {
                                  setShowCommentForm(false);
                                  reset();
                                }}
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                className="post-button"
                              >
                                Post Comment
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Edit Form */
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="edit-card">
              <div className="edit-card-body">
                <h2 className="edit-title">Edit Article</h2>
                <form onSubmit={handleSubmit(onSave)}>
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      defaultValue={currentArticle.title}
                      {...register("title", { required: true })}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      {...register("category", { required: true })}
                      id="category"
                      className="form-select"
                      defaultValue={currentArticle.category}
                    >
                      <option value="programming">Programming</option>
                      <option value="AI&ML">AI & Machine Learning</option>
                      <option value="database">Database</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="content" className="form-label">
                      Content
                    </label>
                    <textarea
                      {...register("content", { required: true })}
                      className="form-textarea"
                      id="content"
                      rows="15"
                      defaultValue={currentArticle.content}
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setEditArticleStatus(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-button"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;