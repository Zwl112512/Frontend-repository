// src/pages/FavoriteHotelsPage.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/FavoriteHotelsPage.css';

type Hotel = {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  starRating?: number;
  imageUrl?: string;
};

const FavoriteHotelsPage = () => {
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.favorites || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (hotelId: string) => {
    try {
      await api.post(`/favorites/${hotelId}`);
      setFavorites(favorites.filter(h => h._id !== hotelId));
    } catch (err) {
      console.error('Unfavorite failed:', err);
      alert('Unable to unfavorite');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="cyber-container">
      <h1 className="cyber-heading mb-6">My Favorite Hotels</h1>
      {loading ? (
        <p className="text-cyan-300">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-400">You haven't favorited any hotels yet.</p>
      ) : (
        <div className="favorite-grid">
          {favorites.map((hotel) => (
            <div key={hotel._id} className="favorite-card">
              {hotel.imageUrl && (
                <img
                  src={`http://localhost:3000${hotel.imageUrl}`}
                  alt={hotel.name}
                  className="favorite-image"
                />
              )}
              <h2
                className="favorite-name"
                onClick={() => navigate(`/hotels/${hotel._id}`)}
              >
                {hotel.name}
              </h2>
              <p className="favorite-location">{hotel.location}</p>
              <p className="favorite-price">HKD {hotel.pricePerNight} / night</p>
              {hotel.starRating && <p className="favorite-stars">⭐ {hotel.starRating}</p>}
              <button
                onClick={() => toggleFavorite(hotel._id)}
                className="favorite-remove"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteHotelsPage;
