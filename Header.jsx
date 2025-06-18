import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [name, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found');
      return;
    }

    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.user && data.user.name) {
          setUsername(data.user.name);
          localStorage.setItem('name', data.user.name); // optional caching
        } else {
          console.warn('Failed to fetch user name:', data.error);
          setUsername(null);
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUsername(null);
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
      }
    };

    fetchUserName();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <h2>Crypto News Portal</h2>

      {name ? (
        <span className="welcome-text">Welcome, {name}</span>
      ) : (
        <span className="welcome-text">Welcome, Guest</span>
      )}

      <div className="nav-profile">
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/favourites">Favourite News</Link>
        </nav>

        <div className="profile-section" ref={dropdownRef}>
          <img
            src="/profile.png"
            alt="Profile"
            className="profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer' }}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
