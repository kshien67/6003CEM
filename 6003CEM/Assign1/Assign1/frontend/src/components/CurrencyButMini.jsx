// 📁 Path: frontend/src/components/ExchangeButMini.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MiniChart from './MiniCurrencyChart';

function ExchangeButMini() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRates = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/exchange/favourites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const topRates = response.data?.slice(0, 5) || [];
        setRates(topRates);
      } catch (err) {
        console.error("❌ Failed to load exchange favourites:", err);
        setRates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="-mt-4">
      {/* 🔹 Header and Explore button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Currency Exchange</h2>
        <button
          onClick={() => navigate('/currency')}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Explore Rates
        </button>
      </div>

      {/* 🔄 Conditional content */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : rates.length === 0 ? (
        <p className="text-sm text-gray-600">No exchange rates saved yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {rates.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-white"
              >
                {/* 🪙 Currency Pair */}
                <div className="flex flex-col">
                  <span className="font-medium">{item.base} → {item.target}</span>
                  <span className="text-sm text-gray-500">Favourite</span>
                </div>

                {/* 💱 Exchange Rate */}
                <div className="text-right min-w-[60px]">
                  <span className="text-sm text-gray-800 font-semibold">
                    {item.rate ? item.rate.toFixed(2) : "—"}
                    <div className="flex items-center gap-2 min-w-[140px] justify-end">
                      <MiniChart base={item.base} target={item.target} />
                    </div>

                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* 🔽 See more button */}
          <div className="mt-3 text-right">
            <button
              onClick={() => navigate('/currency')}
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

export default ExchangeButMini;