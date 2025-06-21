import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

function CurrencyGraphPage() {
  const { base, target } = useParams();
  const [data, setData] = useState([]);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  const getDateRange = () => {
    const today = new Date();
    let pastDate = new Date();

    switch (range) {
      case '1d':
        pastDate.setDate(today.getDate() - 1);
        break;
      case '7d':
        pastDate.setDate(today.getDate() - 7);
        break;
      case '1m':
        pastDate.setMonth(today.getMonth() - 1);
        break;
      case '3m':
        pastDate.setMonth(today.getMonth() - 3);
        break;
      case '6m':
        pastDate.setMonth(today.getMonth() - 6);
        break;
      case '1y':
        pastDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        pastDate.setDate(today.getDate() - 7);
    }

    const format = (date) => date.toISOString().split('T')[0];
    return { from: format(pastDate), to: format(today) };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { from, to } = getDateRange();

      try {
        const res = await axios.get(`https://api.frankfurter.app/${from}..${to}?from=${base}&to=${target}`);
        const chartData = Object.entries(res.data.rates).map(([date, rate]) => ({
          x: date,
          y: rate[target],
        }));
        setData(chartData);
      } catch (err) {
        console.error('❌ Error fetching graph data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base, target, range]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Rate: ${ctx.parsed.y.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: `Rate (${base} to ${target})` },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: `${base} → ${target}`,
        data: data,
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {base} → {target} Exchange Rate Graph
      </h2>

      <div className="mb-4">
        <Link to="/currency" className="text-blue-600 underline text-sm hover:text-blue-800">
          ← Back to Currency Page
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['1d', '7d', '1m', '3m', '6m', '1y'].map((label) => (
          <button
            key={label}
            onClick={() => setRange(label)}
            className={`px-3 py-1 rounded text-sm ${
              range === label ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full h-[400px] bg-white border rounded shadow">
        {loading ? (
          <p className="text-gray-500 text-sm p-4">Loading chart...</p>
        ) : data.length === 0 ? (
          <p className="text-red-500 text-sm p-4">No data available.</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default CurrencyGraphPage;