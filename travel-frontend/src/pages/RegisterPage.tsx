import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/users/register', { username, email, password });

      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful. Redirecting...');
      setTimeout(() => navigate('/hotels'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-container">
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="cyber-form">
          <h1 className="cyber-title">Register</h1>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="cyber-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cyber-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="cyber-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="cyber-input"
          />
          <button type="submit" className="cyber-button mt-4 w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="mt-4 text-center text-white">
            Already have an account? <Link to="/login" className="cyber-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
