import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in to view your watchlist.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/crypto/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error("❌ Watchlist fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleDelete = async (coinId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in to delete coins.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/crypto/delete/${coinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWatchlist((prev) => prev.filter((coin) => coin.coinId !== coinId));
      alert("✅ Removed from watchlist.");
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("❌ Failed to delete.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>

      <div className="mb-6 flex gap-4">
        <Link
          to="/home"
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
        >
          ← Back to HomePage
        </Link>
        <Link
          to="/dashboard"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          Back to Explore
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : watchlist.length === 0 ? (
        <p className="text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Logo</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-left">Price (USD)</th>
                <th className="px-4 py-3 text-left">Market Cap</th>
                <th className="px-4 py-3 text-left">7d Chart</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 bg-white">
              {watchlist.map((coin) => (
                <tr key={coin.coinId} className="border-t hover:bg-gray-50 transition-all">
                  <td className="px-4 py-2">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/coin/${coin.coinId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {coin.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 uppercase">{coin.symbol}</td>
                  <td className="px-4 py-2">
                    {coin.current_price ? `$${coin.current_price.toLocaleString()}` : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : "N/A"}
                  </td>
                  <td className="px-4 py-2 w-[100px]">
                    {coin.sparkline?.length > 0 ? (
                      <Sparklines data={coin.sparkline} width={100} height={30} margin={2}>
                        <SparklinesLine color="blue" style={{ strokeWidth: 1 }} />
                      </Sparklines>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(coin.coinId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
