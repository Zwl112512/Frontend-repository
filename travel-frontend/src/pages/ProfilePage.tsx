import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../services/api';

type User = {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users/me');
        const u: User = res.data.user;
        setUser(u);
        setUsername(u.username);
        setEmail(u.email);
        if (u.avatarUrl) {
          setAvatarPreview(`http://localhost:3000${u.avatarUrl}`);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    })();
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      let avatarUrl = user?.avatarUrl;
      if (avatarFile) {
        const form = new FormData();
        form.append('image', avatarFile);
        const up = await api.post('/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = up.data.url;
      }

      const payload: any = { username, email };
      if (avatarUrl) payload.avatarUrl = avatarUrl;

      const upd = await api.put('/users/me', payload);
      setMessage('Profile updated successfully');
      localStorage.setItem('username', upd.data.user.username);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="cyber-container">
      <h1 className="cyber-title mb-6">User Profile</h1>
      <form onSubmit={handleSubmit} className="cyber-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="cyber-input"
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cyber-input"
          placeholder="Email"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="cyber-input"
        />
{avatarPreview && (
  <img
    src={avatarPreview}
    alt="Avatar Preview"
    className="profile-avatar-preview"
  />
)}

        <button type="submit" className="cyber-button mt-2 w-full">
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
};

export default ProfilePage;
