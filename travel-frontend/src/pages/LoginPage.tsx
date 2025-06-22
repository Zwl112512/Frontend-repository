import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('role', user.role); // 儲存角色

      // 根據角色導向不同頁面
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/hotels');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="cyber-container">
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="cyber-form">
          <h2 className="cyber-title">登入 Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="cyber-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="cyber-input"
          />
          <button type="submit" className="cyber-button mt-4 w-full">
            登入
          </button>
          <p className="mt-4 text-center text-white">
            還沒有帳號？ <Link to="/register" className="cyber-link">註冊</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
