import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

function CryptoList() {
  const [topCoins, setTopCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/crypto?limit=15")
      .then((res) => setTopCoins(res.data))
      .catch((err) => console.error("❌ Error fetching top coins:", err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const searchRes = await axios.get(
          `https://api.coingecko.com/api/v3/search?query=${searchTerm}`
        );
        const ids = searchRes.data.coins.map((coin) => coin.id).slice(0, 10);

        if (ids.length === 0) {
          setSearchResults([]);
          return;
        }

        const marketRes = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: "usd",
              ids: ids.join(","),
              sparkline: true,
              price_change_percentage: "24h",
            },
          }
        );

        setSearchResults(marketRes.data);
      } catch (err) {
        console.error("❌ Enhanced search error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const coinsToDisplay =
    searchTerm && searchResults.length > 0 ? searchResults : topCoins;

  const sortedCoins = [...coinsToDisplay].sort((a, b) => {
    const aVal =
      sortBy === "price"
        ? a.current_price || 0
        : sortBy === "market_cap"
        ? a.market_cap || 0
        : a.price_change_percentage_24h || 0;
    const bVal =
      sortBy === "price"
        ? b.current_price || 0
        : sortBy === "market_cap"
        ? b.market_cap || 0
        : b.price_change_percentage_24h || 0;

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const handleSave = async (coin) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in to save coins.");
      return;
    }

    try {
      const payload = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        image: coin.image,
        last_updated: coin.last_updated,
        sparkline_in_7d: coin.sparkline_in_7d,
      };

      await axios.post("http://localhost:5000/api/crypto/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Coin saved!");
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("❌ Save failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top 15 Cryptocurrencies</h2>

      <div className="mb-6 flex gap-4">
        <Link
          to="/home"
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded transition"
        >
          ← Back to HomePage
        </Link>
        <Link
          to="/watchlist"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          My Watchlist
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 max-w-3xl">
        <input
          type="text"
          placeholder="Search coin name or symbol..."
          className="p-2 border rounded grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="price">Sort by Price</option>
          <option value="market_cap">Sort by Market Cap</option>
          <option value="change">Sort by 24h Change</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-gray-300 px-3 py-2 rounded"
        >
          {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Logo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">Price (USD)</th>
              <th className="px-4 py-3 text-left">24h Change</th>
              <th className="px-4 py-3 text-left">Market Cap</th>
              <th className="px-4 py-3 text-left">7d Chart</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 bg-white">
            {sortedCoins.map((coin) => (
              <tr key={coin.id} className="border-t hover:bg-gray-50 transition-all">
                <td className="px-4 py-2">
                  <img src={coin.image || coin.thumb} alt={coin.name} className="w-6 h-6" />
                </td>
                <td className="px-4 py-2">
                  {coin.api_symbol ? (
                    <span>{coin.name}</span>
                  ) : (
                    <Link
                      to={`/coin/${coin.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {coin.name}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-2 uppercase">{coin.symbol}</td>
                <td className="px-4 py-2">
                  {coin.current_price !== undefined && coin.current_price !== null
                    ? `$${coin.current_price.toLocaleString()}`
                    : "N/A"}
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    typeof coin.price_change_percentage_24h === "number"
                      ? coin.price_change_percentage_24h >= 0
                        ? "text-green-600"
                        : "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {typeof coin.price_change_percentage_24h === "number"
                    ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : "N/A"}
                </td>
                <td className="px-4 py-2 w-[100px]">
                  {coin.sparkline_in_7d?.price?.length > 0 ? (
                    <Sparklines
                      data={coin.sparkline_in_7d.price}
                      limit={20}
                      width={100}
                      height={30}
                      margin={2}
                    >
                      <SparklinesLine
                        color={coin.price_change_percentage_24h >= 0 ? "green" : "red"}
                        style={{ strokeWidth: 1 }}
                      />
                    </Sparklines>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {!coin.api_symbol && (
                    <button
                      onClick={() => handleSave(coin)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {sortedCoins.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  No matching coins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CryptoList;
