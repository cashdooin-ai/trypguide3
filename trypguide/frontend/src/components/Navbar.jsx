import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, BookOpen } from 'lucide-react';
import { isAuthenticated, getAuthData, clearAuthData } from '../utils/helpers';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = getAuthData();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">TrypGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/flights" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Flights
            </Link>
            <Link to="/hotels" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Hotels
            </Link>
            <Link to="/trains" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Trains
            </Link>
            <Link to="/buses" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Buses
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.firstName}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/bookings"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 fade-in">
            <Link to="/flights" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Flights
            </Link>
            <Link to="/hotels" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Hotels
            </Link>
            <Link to="/trains" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Trains
            </Link>
            <Link to="/buses" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Buses
            </Link>
            {authenticated ? (
              <>
                <Link to="/bookings" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  My Bookings
                </Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
