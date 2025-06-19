import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './components/HomePage';
import CryptoNews from './components/CryptoNews';
import AllNewsPage from './components/AllNewsPage';
import FavouriteNewsPage from './components/FavouriteNewsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

import CryptoList from './components/CryptoList';
import CoinDetails from './components/CoinDetails';
import Watchlist from './components/Watchlist';
import CurrencyPage from './components/CurrencyPage'; // 👈 Import your Currency page

function App() {
  return (
    <Router>
      <Header />
      <div className="page-content">
        <Routes>
          {/* 🔐 Auth routes */}
            <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🏠 Home and News */}
          <Route path="/home" element={<HomePage />}>
            <Route index element={<CryptoNews />} />
          </Route>

          {/* 💱 Currency Page */}
          <Route path="/currency" element={<CurrencyPage />} /> {/* 👈 New route here */}

          {/* 💹 Crypto-related */}
          <Route path="/dashboard" element={<CryptoList />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />

          {/* 📰 News */}
          <Route path="/all-news" element={<AllNewsPage />} />
          <Route path="/favourites" element={<FavouriteNewsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;