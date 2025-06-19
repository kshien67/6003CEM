import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

      // Remove from UI
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
            <th className="px-4 py-2 text-left">
              <div className="flex items-center gap-2">Base</div>
            </th>
            <th className="px-4 py-2 text-left">
              <div className="flex items-center gap-2">Target</div>
            </th>
            <th className="px-4 py-2 text-left">
              <div className="flex items-center">Exchange Rate</div>
            </th>
            <th className="px-4 py-2 text-left">
              <div className="flex items-center">Action</div>
            </th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800 bg-white">
          {favourites.map((item, index) => (
            <tr key={index} className="border-t">
              {/* Base column */}
              <td className="px-4 py-2 flex items-center gap-2">
                <img
                  src={getFlagURL(item.base)}
                  alt={`${item.base} flag`}
                  className="w-5 h-4 border rounded-sm"
                  onError={(e) =>
                  (e.target.src =
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png')
                  }
                />
                {item.base}
              </td>

              {/* Target column */}
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagURL(item.target)}
                    alt={`${item.target} flag`}
                    className="w-5 h-4 border rounded-sm"
                    onError={(e) => {
                      e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png';
                    }}
                  />
                  {item.target}
                </div>
              </td>

              {/* Rate column */}
              <td className="px-4 py-2">
                {item.rate?.toLocaleString() ?? '—'}
              </td>

              {/* Action column */}
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(item.base, item.target)}
                  className="text-sm text-red-600 hover:underline"
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