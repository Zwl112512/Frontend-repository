// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailPage from './pages/HotelDetailPage';
import MyReviewsPage from './pages/MyReviewsPage';
import MainLayout from './components/MainLayout';
import FavoriteHotelsPage from './pages/FavoriteHotelsPage';
import BookingListPage from './pages/BookingListPage';
import ProfilePage from './pages/ProfilePage';  
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserListPage from './pages/AdminUserList';
import AdminBookingList from './pages/AdminBookingList';
import AdminReviewList from './pages/AdminReviewList';
import AdminHotelList from './pages/AdminHotelList';


function App() {
  return (
    <Router>
      <Routes>
        {/* login 不套用 MainLayout */}
        <Route path="/login" element={<LoginPage />} />

        {/* 下面所有路由都套用 MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/reviews/me" element={<MyReviewsPage />} />
          <Route path="/favorites" element={<FavoriteHotelsPage />} />
          <Route path="/bookings" element={<BookingListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
           <Route path="/register" element={<RegisterPage />} />
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="/admin/users" element={<AdminUserListPage />} />
           <Route path="/admin/bookings" element={<AdminBookingList />} />
           <Route path="/admin/reviews" element={<AdminReviewList />} />
           <Route path="/admin/hotels" element={<AdminHotelList />} />
        </Route>

        {/* 其他一律導到 /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
