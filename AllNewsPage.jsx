import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AllNewsPage() {
  const [articles, setArticles] = useState([]);
  const [lovedArticles, setLovedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  const articlesPerPage = 10;

  const fetchNewsAndFavourites = async () => {
    setLoading(true);
    const username = localStorage.getItem('username');

    try {
      const [newsRes, favRes] = await Promise.all([
        axios.get('http://localhost:5000/api/crypto-news'),
        username ? axios.get(`http://localhost:5000/api/favourites?username=${username}`) : Promise.resolve({ data: [] })
      ]);

      if (newsRes.data.articles) {
        setArticles(newsRes.data.articles);
        setTotalPages(Math.ceil(newsRes.data.articles.length / articlesPerPage));
      }

      if (favRes.data) {
        const favTitles = favRes.data.map(item => item.title);
        setLovedArticles(favTitles);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load news or favourites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsAndFavourites();
  }, [location.pathname]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleLove = async (article) => {
    const isLoved = lovedArticles.includes(article.title);
    const username = localStorage.getItem('username');

    if (!username) {
      alert('Please login to use favourites.');
      return;
    }

    try {
      if (isLoved) {
        await axios.delete('http://localhost:5000/api/favourites', {
          data: { username, title: article.title }
        });
        setLovedArticles(prev => prev.filter(t => t !== article.title));
      } else {
        await axios.post('http://localhost:5000/api/favourites', {
          username,
          title: article.title,
          url: article.url,
          urlToImage: article.urlToImage,
          description: article.description,
          publishedAt: article.publishedAt,
        });
        setLovedArticles(prev => [...prev, article.title]);
      }
    } catch (err) {
      console.error('Error updating favourite:', err);
    }
  };

  if (loading) return <div>Loading all news...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="full-page-news">
      <div className="news-container">
        <h2>All Crypto News</h2>
        {currentArticles.map((article, index) => {
          const date = new Date(article.publishedAt);
          const formattedDate = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }).replace(',', '');

          const isLoved = lovedArticles.includes(article.title);

          return (
            <div key={index} className="news-article">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{article.title}</h3>
                <span
                  style={{
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: isLoved ? 'gold' : 'grey',
                  }}
                  onClick={() => toggleLove(article)}
                  title={isLoved ? 'Remove from favourites' : 'Add to favourites'}
                >
                  ★
                </span>
              </div>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  style={{ maxWidth: '200px' }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <p>{article.description || ''}</p>
              <p className="news-time">Published on: {formattedDate}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
              <hr />
            </div>
          );
        })}

        <div className="pagination">
          {currentPage > 1 && <button onClick={() => paginate(currentPage - 1)}>Previous</button>}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages && <button onClick={() => paginate(currentPage + 1)}>Next</button>}
        </div>
      </div>
    </div>
  );
}

export default AllNewsPage;
