import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const { name, username, password } = form;

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Registration failed with status ${res.status}`);
      }

      const data = await res.json();
      setMessage('✅ Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '20px' }}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            ...styles.button,
            backgroundColor: submitting ? '#999' : '#007bff',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Already have an account?{' '}
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </p>

      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.includes('successful') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default RegisterPage;
