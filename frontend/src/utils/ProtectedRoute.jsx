import React, {useState, useEffect} from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// This will protect the admin page from unauthenticated user passing url directly
const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return !isLoggedIn ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
