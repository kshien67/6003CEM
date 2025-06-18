import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../App.css';

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
        setUser(data.user); // expects { user: { name, username, ... } }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Log user so it's "used" and eslint warning is removed
  useEffect(() => {
    if (user) {
      console.log('User data:', user);
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '50px', fontSize: '18px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="top">
        <div className="top-left">
          A1
          {/*<Outlet context="top-left" /> {/* NEW: for A1 */}
        </div>
        <div className="top-right">
          A2
          {/*<Outlet context="top-right" /> {/* NEW: for A1 */}
        </div>
      </div>

      <div className="bottom">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Outlet context="bottom" /> {/* Displays nested route like CryptoNews */}
      </div>
    </div>
  );
}
