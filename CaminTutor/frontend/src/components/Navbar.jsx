import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CaminTutor
        </Link>
        <div className="space-x-6 flex items-center">
          {/* 1. Add new links here */}
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">
            Contact
          </Link>

          {/* 2. Keep the user links separate */}
          <div className="pl-6 border-l border-gray-200 flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;