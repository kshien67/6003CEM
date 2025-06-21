// 📁 frontend/src/components/MiniChart.jsx

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    TimeScale,
    LinearScale,
    Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip);

function MiniChart({ base = 'USD', target = 'MYR' }) {
    const [dataPoints, setDataPoints] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6);

            const formatDate = (date) => date.toISOString().split('T')[0];
            const from = formatDate(sevenDaysAgo);
            const to = formatDate(today);

            try {
                const res = await axios.get(
                    `https://api.frankfurter.app/${from}..${to}?from=${base}&to=${target}`
                );

                const points = Object.entries(res.data.rates).map(([date, rate]) => ({
                    x: date,
                    y: rate[target],
                }));

                setDataPoints(points);
            } catch (err) {
                console.error("❌ Chart fetch error:", err);
            }
        };

        fetchData();
    }, [base, target]);

    if (dataPoints.length === 0) return null;

    const chartData = {
        datasets: [
            {
                label: '',
                data: dataPoints,
                borderColor: '#3b82f6',
                borderWidth: 1,
                pointRadius: 0,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                display: false,
            },
            y: {
                display: false,
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false, // ✅ disables on-hover values/numbers
            },
        },
    };


    return (
        <div style={{ width: 80, height: 30 }}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default MiniChart;
