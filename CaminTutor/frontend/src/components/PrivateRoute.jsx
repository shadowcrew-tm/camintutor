import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// This component wraps routes that require authentication
// It can also check for an 'admin' role if adminOnly is true

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Wait until the auth state is loaded
    return <div className="text-center">Loading...</div>;
  }

  // 1. Check if user is logged in
  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // 2. Check if the route requires admin and if the user is an admin
  if (adminOnly && user.role !== 'admin') {
    // If admin is required and user is not admin, redirect to home
    return <Navigate to="/" />;
  }

  // 3. If all checks pass, render the protected component
  return children;
};

export default PrivateRoute;