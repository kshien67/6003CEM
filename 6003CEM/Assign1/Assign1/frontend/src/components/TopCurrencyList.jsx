import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TopCurrencyList() {
  const [allRates, setAllRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetchTopRates = async () => {
      try {
        const res = await axios.get('https://api.frankfurter.app/latest?from=USD');
        const rates = res.data.rates;

        const parsedRates = Object.entries(rates).map(([code, rate]) => ({
          code,
          base: 'USD',
          target: code,
          pair: `USD → ${code}`,
          rate,
        }));

        const sorted = parsedRates.sort((a, b) => b.rate - a.rate);

        setAllRates(sorted);
        setFilteredRates(sorted);
      } catch (err) {
        console.error('❌ Failed to fetch currencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRates();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const results = allRates.filter((rate) =>
      rate.code.toLowerCase().includes(lower)
    );
    setFilteredRates(results);
  }, [search, allRates]);

  const handleSave = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please log in to save favourites.');
      return;
    }

    setSaving(item.target);

    try {
      await axios.post(
        'http://localhost:5000/api/exchange/save',
        {
          base: item.base,
          target: item.target,
          rate: item.rate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`✅ ${item.base} → ${item.target} saved!`);
    } catch (err) {
      console.error('❌ Failed to save currency:', err);
      alert('Failed to save. It might already be in your favourites.');
    } finally {
      setSaving(null);
    }
  };

  const getFlagURL = (currencyCode) => {
    const cc = currencyCode.slice(0, 2).toLowerCase();
    return `https://flagcdn.com/24x18/${cc}.png`;
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading top currencies...</p>;
  }

  const displayedRates = search ? filteredRates : filteredRates.slice(0, 15);

  return (
    <div>
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search currency code (e.g. EUR, MYR, JPY)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded text-sm"
      />

      {/* 📄 Results */}
      {displayedRates.length === 0 ? (
        <p className="text-sm text-gray-500">No matches found.</p>
      ) : (
        <div className="space-y-2">
          {displayedRates.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-white"
            >
              <div className="flex items-center gap-2 font-medium">
                <img
                  src={getFlagURL(item.target)}
                  alt={`${item.target} flag`}
                  className="w-5 h-4 rounded-sm border"
                  onError={(e) =>
                    (e.target.src =
                      'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png')
                  }
                />
                {item.pair}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-800 font-semibold">
                  {item.rate.toFixed(4)}
                </span>
                <button
                  onClick={() => handleSave(item)}
                  disabled={saving === item.target}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    saving === item.target
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {saving === item.target ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopCurrencyList;