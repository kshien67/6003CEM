import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages on new submit

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        setMessage('Login successful');
        navigate('/home');
      } else {
        // Show backend error or fallback message
        setMessage(data.error || 'Wrong username or password');
      }
    } catch (error) {
      setMessage('Network error, please try again.');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          gap: '15px',
        }}
      >
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        {message && (
          <p style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>{message}</p>
        )}
      </form>

      <p style={{ marginTop: '20px' }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
