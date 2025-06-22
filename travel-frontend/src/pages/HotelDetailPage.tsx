import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/HotelDetailPage.css';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  starRating?: number;
  pricePerNight: number;
  imageUrl?: string;
  averageRating?: number;
  numReviews?: number;   
}
interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
}



export default function HotelDetailPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchHotel();
    fetchReviews();
    checkFavorite();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const res = await api.get(`/hotels/${id}`);
      setHotel(res.data);
    } catch (err) {
      console.error('Failed to fetch hotel:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await api.get(`/favorites/${id}`);
      setIsFavorite(res.data.isFavorite);
    } catch {
      // not logged in
    }
  };

  const handleBooking = async () => {
    try {
      await api.post('/bookings', { hotel: id, checkIn, checkOut, guests });
      alert('Booking created!');
    } catch {
      alert('Booking failed');
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
         await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch {
      alert('Failed to update favorite');
    }
  };

  const handleReview = async () => {
    try {
      await api.post('/reviews', {
        hotelId: id,
        rating: newRating,
        comment: newComment,
      });
      setNewRating(5);
      setNewComment('');
      fetchReviews();
    } catch {
      alert('Failed to submit review');
    }
  };

  if (!hotel) return <div className="cyber-container">Loading...</div>;

  return (
    <div className="cyber-container">
      <div className="detail-grid">
        <div className="left-info">
          <h1 className="cyber-title">{hotel.name}</h1>
          <p className="cyber-highlight">{hotel.location}</p>
          <p>⭐ {hotel.starRating || '-'} stars</p>
          {hotel.averageRating !== undefined && (
          <p>⭐ Average Rating: {hotel.averageRating.toFixed(1)} / 5 ({hotel.numReviews || 0} reviews)</p>
          )}
<p>💴 HKD {hotel.pricePerNight} / night</p>
          <button onClick={handleFavorite} className="cyber-button mt-3">
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>

        {hotel.imageUrl && (
          <div className="right-image">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="hotel-preview"
            />
          </div>
        )}
      </div>

      <div className="booking-form mb-10 space-y-2">
        <h2 className="cyber-subtitle">Make a Booking</h2>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="cyber-input"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="cyber-input"
        />
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="cyber-input"
        />
        <button onClick={handleBooking} className="cyber-button">
          Book Now
        </button>
      </div>

      <div className="review-section space-y-4">
        <h2 className="cyber-subtitle">Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="cyber-review">
            <p className="cyber-highlight">Rating: {r.rating}</p>
            <p>
              <strong>{r.username}</strong>: {r.comment}
            </p>
          </div>
        ))}

        <div className="pt-4 space-y-2">
          <h3 className="cyber-subtitle">Add a Review</h3>
          <select
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
            className="cyber-select"
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>
                {val} Stars
              </option>
            ))}
          </select>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="cyber-textarea"
            placeholder="Write your comment..."
          />
          <button onClick={handleReview} className="cyber-button">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
