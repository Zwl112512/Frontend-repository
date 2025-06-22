// src/components/MainLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import HotelSearchBar from './HotelSearchBar';

export default function MainLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-4 border-b shadow-sm">
        {pathname.startsWith('/hotels') && <HotelSearchBar />}
        <UserMenu />
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
