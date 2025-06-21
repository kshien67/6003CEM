import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CurrencyChart({ base = 'USD', target = 'MYR' }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`https://api.frankfurter.app/2024-05-01..2024-06-01?from=${base}&to=${target}`);
        const points = Object.entries(response.data.rates).map(([date, rate]) => ({
          date,
          rate: rate[target],
        }));
        setData(points);
      } catch (err) {
        console.error("❌ Chart data fetch failed:", err);
      }
    };

    fetchChartData();
  }, [base, target]);

  if (data.length === 0) return <p className="text-sm text-gray-500">Loading chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CurrencyChart;
