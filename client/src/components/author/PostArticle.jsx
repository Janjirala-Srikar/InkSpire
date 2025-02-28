import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useNavigate } from 'react-router-dom';
import './PostArticle.css';

function PostArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function postArticle(articleObj) {
    console.log(articleObj);

    // Create article object as per article schema
    const authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
    };
    articleObj.authorData = authorData;

    // Article ID (timestamp)
    articleObj.articleId = Date.now();

    // Format date properly
    const formatDate = (date) => {
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
    };

    // Add date of creation & date of modification
    const currentDate = new Date();
    articleObj.dateOfCreation = formatDate(currentDate);
    articleObj.dateOfModification = formatDate(currentDate);

    // Add comments array
    articleObj.comments = [];

    // Add article active state
    articleObj.isArticleActive = true;

    try {
      // Make HTTP POST request to create new article in backend
      const res = await axios.post('http://localhost:3000/author-api/article', articleObj);
      if (res.status === 201) {
        // Navigate to articles component
        navigate(`/author-profile/${currentUser.email}/articles`);
      }
    } catch (error) {
      console.error("Error posting article:", error);
      // Here you could add state management for error handling
    }
  }

  return (
    <div className="post-article-container">
      <div className="content-wrapper">
        <div className="article-form-card">
          <div className="form-header">
            <h2>Create New Article</h2>
          </div>
          <div className="form-body">
            <form onSubmit={handleSubmit(postArticle)}>
              <div className="form-group">
                <label htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter article title"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="error-message">{errors.title.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  id="category"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="programming">Programming</option>
                  <option value="AI&ML">AI & ML</option>
                  <option value="database">Database</option>
                  <option value="web-development">Web Development</option>
                  <option value="cybersecurity">Cybersecurity</option>
                </select>
                {errors.category && (
                  <p className="error-message">{errors.category.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="content">
                  Content
                </label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  id="content"
                  rows="12"
                  placeholder="Write your article content here..."
                ></textarea>
                {errors.content && (
                  <p className="error-message">{errors.content.message}</p>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;