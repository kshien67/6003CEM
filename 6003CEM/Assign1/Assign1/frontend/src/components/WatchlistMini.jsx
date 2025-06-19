// 📁 Path: frontend/src/components/WatchlistMini.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparklines, SparklinesLine } from 'react-sparklines';

function WatchlistMini() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  // 🧠 Fetch the user's watchlist from backend (limit to 5 items)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get('http://localhost:5000/api/crypto/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setWatchlist(res.data.slice(0, 5))) // only show top 5
      .catch((err) =>
        console.error('❌ Mini watchlist load error:', err)
      );
  }, []);

  return (
    <div className="-mt-4"> {/* 🔼 Pull this component upward slightly */}
      {/* 🧩 Header and explore button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">My Watchlist</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Explore Crypto
        </button>
      </div>

      {/* 📈 Watchlist rendering */}
      {watchlist.length === 0 ? (
        <p className="text-sm text-gray-600">No coins saved yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {watchlist.map((coin) => (
              <li
                key={coin.coinId}
                className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-white"
              >
                {/* 👤 Coin Name and Icon */}
                <div className="flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6"
                  />
                  <span className="font-medium">{coin.name}</span>
                </div>

                {/* 💵 Price and Sparkline */}
                <div className="flex items-center gap-3 min-w-[120px] justify-end">
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    ${coin.current_price}
                  </span>
                  {coin.sparkline?.length > 0 && (
                    <Sparklines
                      data={coin.sparkline}
                      width={80}
                      height={30}
                      margin={2}
                    >
                      <SparklinesLine
                        color="blue"
                        style={{ strokeWidth: 1 }}
                      />
                    </Sparklines>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* 🔽 See more button */}
          <div className="mt-3 text-right">
            <button
              onClick={() => navigate('/watchlist')}
              className="text-blue-600 underline text-sm hover:text-blue-800"
            >
              See more →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WatchlistMini;
