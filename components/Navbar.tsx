'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, logout } from '@/store/authSlice';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/places?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
              Tripnowa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/places" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                isActive('/places') 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Destinations
            </Link>
            <Link 
              href="/categories" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                isActive('/categories') 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/world-wonders" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                isActive('/world-wonders') 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              World Wonders
            </Link>
          </div>

          {/* Search & Auth Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 pr-4 bg-[#111]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </form>
            
            {/* Auth Buttons */}
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated && user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all text-sm font-medium shadow-lg hover:shadow-orange-500/50"
                  >
                    <FiSettings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#111]/80 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium backdrop-blur-sm"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden lg:inline">{user.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all text-sm font-medium shadow-lg hover:shadow-red-500/50"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg hover:shadow-blue-500/50"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-in slide-in-from-top">
            <div className="space-y-2">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 bg-[#111]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </form>
              
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/places" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/places') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Destinations
              </Link>
              <Link 
                href="/categories" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/categories') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Categories
              </Link>
              <Link 
                href="/world-wonders" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/world-wonders') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                World Wonders
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
