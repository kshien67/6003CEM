import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "chartjs-adapter-date-fns";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Filler
);

function CoinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("7");

  const timeRanges = {
    "2": "2D",
    "7": "7D",
    "30": "1M",
    "90": "3M",
    "365": "1Y",
    "max": "All",
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/crypto/${id}`)
      .then((res) => setCoin(res.data))
      .catch((err) => console.error("Coin error:", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/crypto/${id}/market_chart?days=${range}`)
      .then((res) => setChartData(res.data.prices))
      .catch((err) => console.error("Chart error:", err));
  }, [id, range]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in first");
      return;
    }

    try {
      const payload = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.market_data.current_price.usd,
        market_cap: coin.market_data.market_cap.usd,
        image: coin.image.large || coin.image.small,
        last_updated: coin.last_updated,
        sparkline_in_7d: { price: chartData.map((point) => point[1]) },
      };

      await axios.post("http://localhost:5000/api/crypto/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Saved to watchlist!");
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("❌ Save failed: " + (err.response?.data?.msg || err.message));
    }
  };

  if (!coin) return <div className="p-4">Loading...</div>;

  const formatUSD = (num) => (num ? `$${num.toLocaleString()}` : "N/A");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* 🔙 Back + Save */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back to List
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save to Watchlist
        </button>
      </div>

      {/* 🔥 Title + Price */}
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-4 flex-wrap">
        {coin.name} ({coin.symbol.toUpperCase()})
        <span
          className={`text-2xl font-semibold ${
            coin.market_data.price_change_percentage_24h >= 0
              ? "text-green-600"
              : "text-red-500"
          } flex items-center gap-1`}
        >
          ${coin.market_data.current_price.usd.toLocaleString()}
          {coin.market_data.price_change_percentage_24h >= 0 ? (
            <FaArrowUp />
          ) : (
            <FaArrowDown />
          )}
          ({coin.market_data.price_change_percentage_24h?.toFixed(2)}%)
        </span>
      </h1>

      {/* 🕒 Range Selector */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {Object.entries(timeRanges).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setRange(value)}
            className={`px-3 py-1 rounded border text-sm ${
              range === value
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 📈 Chart */}
      <div className="bg-white p-4 rounded shadow mb-8">
        {chartData.length > 0 && (
          <Chart
            type="line"
            data={{
              labels: chartData.map(([time]) => new Date(time)),
              datasets: [
                {
                  label: `${coin.name} Price`,
                  data: chartData.map(([_, price]) => price),
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  fill: true,
                  pointRadius: 0,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: range === "2" ? "hour" : "day",
                  },
                  ticks: { maxTicksLimit: 8 },
                },
              },
            }}
          />
        )}
      </div>

      {/* 📊 Stats */}
      <h2 className="text-xl font-semibold mb-2">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 shadow rounded text-sm text-gray-800">
        <Stat label="Market Cap" value={formatUSD(coin.market_data.market_cap.usd)} />
        <Stat label="24h Volume" value={formatUSD(coin.market_data.total_volume.usd)} />
        <Stat
          label="FDV"
          value={formatUSD(coin.market_data.fully_diluted_valuation.usd)}
        />
        <Stat
          label="Vol / Mkt Cap"
          value={
            coin.market_data.total_volume.usd && coin.market_data.market_cap.usd
              ? (
                  (coin.market_data.total_volume.usd /
                    coin.market_data.market_cap.usd) *
                  100
                ).toFixed(2) + "%"
              : "N/A"
          }
        />
        <Stat
          label="Max Supply"
          value={coin.market_data.max_supply?.toLocaleString() || "∞"}
        />
        <Stat
          label="Total Supply"
          value={coin.market_data.total_supply?.toLocaleString() || "N/A"}
        />
        <Stat
          label="Circulating Supply"
          value={coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default CoinDetails;
