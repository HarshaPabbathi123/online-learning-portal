import { Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { getUserFromToken, clearToken } from '@/utils/auth';

const MainLayout = () => {
  const user = getUserFromToken();

  const handleLogout = () => {
    clearToken();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar */}
      <header className="bg-blue-700 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Online Learning Portal</h1>
          <div className="space-x-4">
            {user ? (
              <>
                <span className="font-medium">Role: {user.role}</span>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <a href="/login" className="underline">Login</a>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Page Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <footer className="bg-blue-900 text-white text-center p-4 text-sm">
        © {new Date().getFullYear()} Online Learning Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
