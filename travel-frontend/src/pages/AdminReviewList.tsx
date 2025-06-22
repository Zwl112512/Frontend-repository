import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/AdminReviewList.css';

interface Review {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user?: { username?: string };
  hotel?: { name?: string };
}

interface ReviewStats {
  total: number;
}

const AdminReviewList = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data.reviews || []);
      setStats({ total: res.data.total || 0 });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      setStats((prev) => (prev ? { total: prev.total - 1 } : null));
    } catch {
      alert('Delete failed');
    }
  };

  const filtered = reviews.filter((r) => {
    const username = r.user?.username || '';
    const hotelName = r.hotel?.name || '';
    const matchSearch =
      username.toLowerCase().includes(search.toLowerCase()) ||
      hotelName.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      (!startDate || new Date(r.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(r.createdAt) <= new Date(endDate));
    return matchSearch && matchDate;
  });

return (
  <div className="admin-review-container">
    <h1 className="admin-review-title">Review Management</h1>

    {stats && (
      <div className="review-stats">
        <p>Total Reviews: {stats.total}</p>
      </div>
    )}

    <div className="review-filter">
      <div className="input-group">
        <label htmlFor="search">🔍 Search</label>
        <input
          id="search"
          className="cyber-input"
          placeholder="Search by username or hotel name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="startDate">📅 From</label>
        <input
          id="startDate"
          type="date"
          className="cyber-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="endDate">📅 To</label>
        <input
          id="endDate"
          type="date"
          className="cyber-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>

    {loading && <p className="text-gray-400">Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {!loading && !error && filtered.length === 0 && (
      <p className="text-gray-500">No reviews found.</p>
    )}

    {!loading && !error && filtered.length > 0 && (
      <div className="overflow-x-auto">
        <table className="review-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Hotel</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.username || 'Unknown'}</td>
                <td>{r.hotel?.name || 'Unknown'}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="review-delete-btn"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default AdminReviewList;
