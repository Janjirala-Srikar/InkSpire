import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  async function getArticles() {
    try {
      const token = await getToken({ template: "long_lived_token" });
      const res = await axios.get('http://localhost:3000/author-api/articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch articles');
    }
  }

  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  return (
    <div className='articles-container'>
      {error && <p className='error-message text-danger'>{error}</p>}
      <div className='articles-grid'>
        {articles.map((articleObj) => (
          <div className='article-card' key={articleObj.articleId}>
            <div className="article-card-inner">
              <div className="category-label">
                <span className="category-badge">{articleObj.category || 'programming'}</span>
              </div>
              <h2 className="article-title">{articleObj.title}</h2>
              <p className="article-excerpt">
                {articleObj.content.substring(0, 120) + "..."}
              </p>
              <div className="read-more-link" onClick={() => gotoArticleById(articleObj)}>
                <span>Read more</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              <div className="article-footer">
                <div className="author-info">
                  <div className="author-avatar">
                    {articleObj.authorData.nameOfAuthor?.charAt(0) || 'A'}
                  </div>
                  <span className="author-name">
                    {articleObj.authorData.nameOfAuthor}
                  </span>
                </div>
                <span className="modified-date">
                  Modified - {(articleObj.dateOfModification)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;