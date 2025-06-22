import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/AdminBookingList.css';

interface Booking {
  _id: string;
  user: { username: string };
  hotel: { name: string };
  checkIn: string;
  checkOut: string;
  guests: number;
}

const AdminBookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const filtered = bookings.filter((b) =>
    b.user.username.toLowerCase().includes(search.toLowerCase()) ||
    b.hotel.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-booking-container">
      <h1 className="admin-booking-title">📄 Booking Management</h1>

      <input
        className="cyber-input mb-4"
        placeholder="🔍 Search by username or hotel name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500">No bookings found.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Hotel</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.user.username}</td>
                  <td>{b.hotel.name}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>{b.guests}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="delete-btn"
                    >
                      Delete
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

export default AdminBookingList;
