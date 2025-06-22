import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HotelListPage.css';
import { getImageUrl } from '../utils/image';
import HotelSearchBar from '../components/HotelSearchBar';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  starRating?: number;
  pricePerNight: number;
  imageUrl?: string;
}

export default function HotelListPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      const page = Number(params.get('page')) || 1;
      setCurrentPage(page);
      const res = await api.get('/hotels', { params: Object.fromEntries(params) });
      setHotels(res.data.hotels || []);
      setTotalPages(res.data.totalPages || 1);
    };
    fetchHotels();
  }, [params]);

  const goToPage = (page: number) => {
    params.set('page', page.toString());
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="hotel-list-container">
      <h1 className="cyber-title">🏨 Explore Hotels</h1>

      <div className="hotel-grid">
        {hotels.map(hotel => (
          <div key={hotel._id} className="hotel-card">
            <img
              src={getImageUrl(hotel.imageUrl)}
              alt={hotel.name}
              className="hotel-image"
            />
            <h2 className="hotel-name">{hotel.name}</h2>
            <p className="hotel-info">📍 {hotel.location}</p>
            <p className="hotel-info">⭐ {hotel.starRating ?? 'N/A'} stars</p>
            <p className="hotel-price">💰 ${hotel.pricePerNight} / night</p>
            <Link to={`/hotels/${hotel._id}`} className="cyber-button">
              View Details
            </Link>
          </div>
        ))}
      </div>

<div className="pagination">

  {/* ◀️ 上一頁 */}
  <button
    className="cyber-button page-button"
    disabled={currentPage === 1}
    onClick={() => goToPage(currentPage - 1)}
  >
    ◀
  </button>

  {/* 頁碼 */}
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => goToPage(i + 1)}
      className={`cyber-button page-button ${currentPage === i + 1 ? 'active' : ''}`}
    >
      {i + 1}
    </button>
  ))}

  {/* ▶️ 下一頁 */}
  <button
    className="cyber-button page-button"
    disabled={currentPage === totalPages}
    onClick={() => goToPage(currentPage + 1)}
  >
    ▶
  </button>
</div>

    </div>
  );
}
