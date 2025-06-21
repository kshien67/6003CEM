import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FavouriteNewsPage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favourites?username=${username}`);
        setFavourites(response.data);
      } catch (err) {
        console.error('Error fetching favourites:', err);
        setError('Failed to load favourites news.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [username]);

  const toggleLove = async (title) => {
    try {
      await axios.delete('http://localhost:5000/api/favourites', {
        data: { username, title },
      });
      // Remove from local state
      setFavourites((prev) => prev.filter((article) => article.title !== title));
    } catch (err) {
      console.error('Error removing favourite:', err);
    }
  };

  if (loading) return <div>Loading favourites news...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="full-page-news">
      <div className="news-container">
        <button onClick={() => navigate('/all-news')} style={{ marginBottom: '20px' }}>
          All News
        </button>

        <h2>My Favourite News</h2>
        {favourites.length === 0 ? (
          <p>You have no favourite articles yet.</p>
        ) : (
          favourites.map((article, index) => {
            const date = new Date(article.publishedAt);
            const formattedDate = date.toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).replace(',', '');

            return (
              <div key={index} className="news-article">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{article.title}</h3>
                  <span
                    style={{ cursor: 'pointer', fontSize: '24px', color: 'gold' }}
                    onClick={() => toggleLove(article.title)}
                    title="Remove from favourites"
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
               <a href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm">
                  Read more
                </a>
                <hr />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default FavouriteNewsPage;
