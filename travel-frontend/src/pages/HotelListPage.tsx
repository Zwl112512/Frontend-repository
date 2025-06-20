import { useEffect, useState } from 'react';
import api from '../services/api';

type Hotel = {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  starRating?: number;
  imageUrl?: string;
};

const HotelListPage = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels');
        setHotels(res.data.hotels || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch hotels');
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">飯店列表</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white p-4 rounded shadow hover:shadow-lg">
            {hotel.imageUrl && (
              <img
                src={`http://localhost:3000${hotel.imageUrl}`}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="text-gray-800 mt-1">💰 每晚 HKD {hotel.pricePerNight}</p>
            {hotel.starRating && (
              <p className="text-yellow-600">⭐ {hotel.starRating} 星</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelListPage;
