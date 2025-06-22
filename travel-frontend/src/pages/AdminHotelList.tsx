import { useEffect, useState } from 'react';
import api from '../services/api';
import { getImageUrl } from '../utils/image';
import '../styles/AdminHotelList.css';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  starRating?: number;
  pricePerNight: number;
  imageUrl?: string;
}

const AdminHotelList = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hotels');
      setHotels(res.data.hotels || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel and all related bookings?')) return;
    try {
      await api.delete(`/hotels/${id}`);
      setHotels(hotels.filter((h) => h._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleSubmit = async () => {
    const body = new FormData();
    body.append('name', formData.name || '');
    body.append('location', formData.location || '');
    body.append('pricePerNight', formData.pricePerNight || '');
    body.append('starRating', formData.starRating || '');
    if (imageFile) body.append('image', imageFile);

    const url = editingId ? `/hotels/${editingId}` : '/hotels';
    const method = editingId ? 'put' : 'post';

    try {
      const res = await api({
        method,
        url,
        data: body,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (editingId) {
        setHotels(hotels.map(h => h._id === editingId ? res.data.hotel : h));
      } else {
        setHotels([res.data.hotel, ...hotels]);
      }
      closeModal();
    } catch (e) {
      alert('Submit failed.');
    }
  };

  const openModal = (hotel?: Hotel) => {
    setEditingId(hotel?._id || null);
    setFormData(hotel || {});
    setPreview(hotel?.imageUrl || null);
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
    setImageFile(null);
    setPreview(null);
  };

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-hotel-container">
      <div className="admin-hotel-header">
        <h1 className="admin-hotel-title">Hotel Management</h1>
        <button onClick={() => openModal()} className="admin-hotel-add-btn">+ New Hotel</button>
      </div>

      <input
        className="admin-hotel-search"
        placeholder="Search by name or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="admin-hotel-msg">Loading...</p>}
      {error && <p className="admin-hotel-error">{error}</p>}

      <div className="admin-hotel-table-wrapper">
        <table className="admin-hotel-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Stars</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h._id}>
                <td>{h.imageUrl && <img src={getImageUrl(h.imageUrl)} alt="" className="hotel-img" />}</td>
                <td>{h.name}</td>
                <td>{h.location}</td>
                <td>{h.starRating || '-'}</td>
                <td>${h.pricePerNight}</td>
                <td>
                  <button onClick={() => openModal(h)} className="action-btn edit">Edit</button>
                  <button onClick={() => handleDelete(h._id)} className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
<div className="modal-content">
  <h2 className="modal-title">{editingId ? 'Edit Hotel' : 'New Hotel'}</h2>

  <div className="modal-field">
    <label htmlFor="name">Hotel Name</label>
    <input
      id="name"
      placeholder="Enter hotel name"
      value={formData.name || ''}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
  </div>

  <div className="modal-field">
    <label htmlFor="location">Location</label>
    <input
      id="location"
      placeholder="Enter location"
      value={formData.location || ''}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
    />
  </div>

  <div className="modal-field">
    <label htmlFor="price">Price Per Night</label>
    <input
      id="price"
      type="number"
      placeholder="Enter price"
      value={formData.pricePerNight || ''}
      onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
    />
  </div>

  <div className="modal-field">
    <label htmlFor="stars">Star Rating</label>
    <input
      id="stars"
      type="number"
      min="1"
      max="5"
      placeholder="Enter star rating"
      value={formData.starRating || ''}
      onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
    />
  </div>

  <div className="modal-field">
    <label htmlFor="image">Hotel Image</label>
    <input
      id="image"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageFile(file);
          setPreview(URL.createObjectURL(file));
        }
      }}
    />
    {preview && <img src={preview} alt="Preview" className="modal-preview" />}
  </div>

  <div className="modal-actions">
    <button onClick={closeModal}>Cancel</button>
    <button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</button>
  </div>
</div>

        </div>
      )}
    </div>
  );
};

export default AdminHotelList;
