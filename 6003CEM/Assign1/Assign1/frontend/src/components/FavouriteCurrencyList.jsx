import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MiniChart from './MiniCurrencyChart';

function FavouriteCurrencyList() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("❌ Please log in to view favourites.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/exchange/favourites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavourites(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch favourites:', error);
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const getFlagURL = (currencyCode) => {
    const cc = currencyCode.slice(0, 2).toLowerCase();
    return `https://flagcdn.com/24x18/${cc}.png`;
  };

  const handleDelete = async (base, target) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("❌ Please log in to delete favourites.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/exchange/delete/${base}/${target}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavourites((prev) =>
        prev.filter((item) => !(item.base === base && item.target === target))
      );
      alert(`✅ Removed ${base} → ${target} from favourites.`);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ Failed to delete currency.");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading favourites...</p>;

  if (favourites.length === 0) {
    return <p className="text-gray-600">No favourite currency yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Base</th>
            <th className="px-4 py-2 text-left">Target</th>
            <th className="px-4 py-2 text-left">Exchange Rate</th>
            <th className="px-4 py-2 text-left">7d Chart</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800 bg-white">
          {favourites.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">
                <div className="inline-flex items-center gap-2">
                  <img
                    src={getFlagURL(item.base)}
                    alt={`${item.base} flag`}
                    className="w-5 h-4 border rounded-sm"
                    onError={(e) => {
                      e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png';
                    }}
                  />
                  <span>{item.base}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="inline-flex items-center gap-2">
                  <img
                    src={getFlagURL(item.target)}
                    alt={`${item.target} flag`}
                    className="w-5 h-4 border rounded-sm"
                    onError={(e) => {
                      e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png';
                    }}
                  />
                  <span>{item.target}</span>
                </div>
              </td>

              <td className="px-4 py-2">{item.rate?.toLocaleString() ?? '—'}</td>
              <td className="px-4 py-2 w-[120px] h-[40px]">
                <MiniChart base={item.base} target={item.target} />
                <Link
                  to={`/currency/graph/${item.base}/${item.target}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Graph
                </Link>
              </td>


              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(item.base, item.target)}
                  className="text-sm text-red-600 hover:underline mr-3"
                >
                  Unfavourite
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FavouriteCurrencyList;
