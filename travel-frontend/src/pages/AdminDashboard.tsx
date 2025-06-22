import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">🔧 Admin Dashboard</h1>

      <div className="admin-dashboard-grid">
        <button
          onClick={() => navigate('/admin/users')}
          className="admin-dashboard-card"
        >
          <div className="admin-dashboard-icon">👥</div>
          <div>
            <h2>User Management</h2>
            <p>View and manage all user accounts</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/hotels')}
          className="admin-dashboard-card"
        >
          <div className="admin-dashboard-icon">🏨</div>
          <div>
            <h2>Hotel Management</h2>
            <p>Edit or delete hotel information</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/reviews')}
          className="admin-dashboard-card"
        >
          <div className="admin-dashboard-icon">📝</div>
          <div>
            <h2>Review Management</h2>
            <p>View and remove user reviews</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/bookings')}
          className="admin-dashboard-card"
        >
          <div className="admin-dashboard-icon">📄</div>
          <div>
            <h2>Booking Management</h2>
            <p>View and delete user bookings</p>
          </div>
        </button>
      </div>
    </div>
  );
}
