import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MyReviewsPage.css';

type Review = {
  _id: string;
  hotelName: string;
  hotelId: string;
  comment: string;
  rating: number;
};

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMyReviews = async () => {
    try {
      const res = await api.get('/reviews/me/reviews');
      setReviews(res.data.reviews || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchMyReviews();
    } catch (err: any) {
      alert('Failed to delete: ' + (err.response?.data?.message || ''));
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="cyber-container">
      <h1 className="cyber-title">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You have not written any reviews.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r._id} className="review-item">
              <div className="review-header">
                <div>
                  <p
                    onClick={() => navigate(`/hotels/${r.hotelId}#review-${r._id}`)}
                    className="hotel-link"
                  >
                    {r.hotelName}
                  </p>
                  <p className="rating">Rating: {r.rating}</p>
                  <p className="comment">{r.comment}</p>
                </div>
                <div className="review-actions">
                  <button
                    onClick={() =>
                      navigate(`/hotels/${r.hotelId}#review-${r._id}`, {
                        state: {
                          editId: r._id,
                          comment: r.comment,
                          rating: r.rating,
                        },
                      })
                    }
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReviewsPage;
