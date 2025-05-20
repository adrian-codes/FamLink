'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { token, user, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href={isAuthenticated ? '/dashboard' : '/login'} className="hover:text-gray-200">
            FamLink
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-gray-200">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/families/manage" className="hover:text-gray-200">
                  Manage Family
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link href="/login" className="hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}