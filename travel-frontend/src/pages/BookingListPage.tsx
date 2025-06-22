// src/pages/BookingListPage.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingListPage.css';

type Booking = {
  _id: string;
  hotel: {
    _id: string;
    name: string;
    location: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  createdAt: string;
};

const BookingListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      fetchBookings();
    } catch (err: any) {
      alert('Delete failed: ' + (err.response?.data?.message || ''));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">My Bookings</h1>

      {loading ? (
        <p className="booking-loading">Loading...</p>
      ) : error ? (
        <p className="booking-error">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="booking-empty">No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} className="booking-card">
              <div className="booking-card-content">
                <div>
                  <p
                    className="booking-hotel-name"
                    onClick={() => navigate(`/hotels/${b.hotel._id}`)}
                  >
                    {b.hotel.name}
                  </p>
                  <p className="booking-hotel-location">{b.hotel.location}</p>
                  <p className="booking-info">Check-in: {new Date(b.checkIn).toLocaleDateString()}</p>
                  <p className="booking-info">Check-out: {new Date(b.checkOut).toLocaleDateString()}</p>
                  <p className="booking-info">Guests: {b.guests}</p>
                  <p className="booking-created">Created at: {formatDate(b.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="booking-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingListPage;
