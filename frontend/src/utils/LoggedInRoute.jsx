import React, {useState, useEffect} from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// This will prevent the logged in users from having to login again when passing login/register page url
const LoggedInRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn ? <Navigate to="/home" replace /> : <Outlet />;
};

export default LoggedInRoute;
