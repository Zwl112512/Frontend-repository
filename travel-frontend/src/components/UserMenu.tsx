// src/components/UserMenu.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState('Account');
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users/me');
        const u = res.data.user;
        setUsername(u.username || 'Account');
        setRole(u.role || null);
        if (u.avatarUrl) {
          setAvatarUrl(`http://localhost:3000${u.avatarUrl}`);
        }
      } catch (e) {
        console.warn('Failed to fetch user info', e);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="user-menu-toggle">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar-fallback">{username.charAt(0).toUpperCase()}</div>
        )}
        <span className="user-name-label">{username}</span>
      </button>

      {open && (
        <div className="user-dropdown">
          {role === 'admin' ? (
            <>
              <button onClick={() => navigate('/admin/dashboard')} className="user-dropdown-item">
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/hotels')} className="user-dropdown-item">Hotel List</button>
              <button onClick={() => navigate('/profile')} className="user-dropdown-item">Profile</button>
              <button onClick={() => navigate('/favorites')} className="user-dropdown-item">Favorites</button>
              <button onClick={() => navigate('/reviews/me')} className="user-dropdown-item">My Reviews</button>
              <button onClick={() => navigate('/bookings')} className="user-dropdown-item">My Bookings</button>
              <hr className="user-dropdown-divider" />
            </>
          )}
          <button onClick={handleLogout} className="user-dropdown-item logout">Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
