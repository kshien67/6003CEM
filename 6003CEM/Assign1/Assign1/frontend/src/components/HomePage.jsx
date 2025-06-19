// 📁 Path: frontend/src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import WatchlistMini from './WatchlistMini';
import CurrencyButMini from './CurrencyButMini';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Unauthorized');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError('Something went wrong. Please try again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center pt-12 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section */}
      <div className="flex h-[350px] border-b border-gray-300">

        {/* A1 - Currency Exchange */}
        <div className="flex-1 border-r border-gray-300 p-4">
          <CurrencyButMini />
        </div>

        {/* A2 - WatchlistMini */}
        <div className="flex-1 p-4">
          <WatchlistMini />
        </div>
      </div>

      {/* Bottom scrollable section */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        <Outlet context="bottom" />
      </div>
    </div>
  );
}