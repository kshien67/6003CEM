// 📁 frontend/src/components/CurrencyPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopCurrencyList from './TopCurrencyList';
import FavouriteCurrencyList from './FavouriteCurrencyList';

function CurrencyPage() {
  const [showTop, setShowTop] = useState(true);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>

      {/* 🔙 Back to HomePage */}
      <div className="mb-4">
        <Link
          to="/home"
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
        >
          ← Back to HomePage
        </Link>
      </div>

      {/* 🔘 Toggle Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowTop(true)}
          className={`px-4 py-2 rounded ${
            showTop
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Top 15
        </button>
        <button
          onClick={() => setShowTop(false)}
          className={`px-4 py-2 rounded ${
            !showTop
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          My Favourites
        </button>
      </div>

      {/* 🧾 Section View */}
      <div className="bg-white p-4 rounded shadow">
        {showTop ? <TopCurrencyList /> : <FavouriteCurrencyList />}
      </div>
    </div>
  );
}

export default CurrencyPage;