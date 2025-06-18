import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Top10CryptoNews from './components/CryptoNews';
import AllNewsPage from './components/AllNewsPage';
import FavouriteNewsPage from './components/FavouriteNewsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage'; // if you have this too

function App() {
  return (
    <Router>
      <Header />
      <div className="page-content">
        <Routes>
          {/* Set the root path to LoginPage */}
          <Route path="/" element={<LoginPage />} />

          {/* Other routes */}
          <Route path="/home" element={<HomePage />}>
            <Route index element={<Top10CryptoNews />} />
          </Route>
          <Route path="/all-news" element={<AllNewsPage />} />
          <Route path="/favourites" element={<FavouriteNewsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
