import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CryptoNews() {
  const [articles, setArticles] = useState([]);
  const [lovedArticles, setLovedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');

        const [newsRes, favRes] = await Promise.all([
          axios.get('http://localhost:5000/api/crypto-news?limit=10&t=' + Date.now()),
          axios.get(`http://localhost:5000/api/favourites?username=${username}`)
        ]);

        if (newsRes.data.articles) {
          setArticles(newsRes.data.articles.slice(0, 10));
        } else {
          setError('No articles found - try again later');
        }

        if (favRes.data) {
          const favTitles = favRes.data.map(item => item.title);
          setLovedArticles(favTitles);
        }
      } catch (err) {
        setError(`API Error: ${err.response?.data?.error || err.message}`);
        console.error('API request failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleLove = async (article) => {
    const isLoved = lovedArticles.includes(article.title);
    const username = localStorage.getItem('username');

    if (!username) {
      alert('Please log in to use favourites.');
      return;
    }

    try {
      if (isLoved) {
        await axios.delete('http://localhost:5000/api/favourites', {
          data: { username, title: article.title },
        });
        setLovedArticles((prev) => prev.filter((t) => t !== article.title));
      } else {
        await axios.post('http://localhost:5000/api/favourites', {
          username,
          title: article.title,
          url: article.url,
          urlToImage: article.urlToImage,
          description: article.description,
          publishedAt: article.publishedAt,
        });
        setLovedArticles((prev) => [...prev, article.title]);
      }
    } catch (err) {
      console.error('Error updating favourite:', err);
    }
  };

  if (loading) return <div>Loading news...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="news-container">
      <h2>Top 10 Crypto News</h2>
      {articles.map((article, index) => {
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
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
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

      <button
        onClick={() => navigate('/all-news')}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Show More
      </button>
    </div>
  );
}

export default CryptoNews;
