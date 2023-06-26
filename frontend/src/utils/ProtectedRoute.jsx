import React, {useState, useEffect} from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SideBar from '../components/SideBar'
import Cookies from 'js-cookie';

// This will protect the admin page from unauthenticated user passing url directly
const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem('access_token');
    const token = Cookies.get('loginToken');
    setIsLoggedIn(!!token);
  }, []);

  // return !isLoggedIn ? <Navigate to="/login" replace /> : <><SideBar/><Outlet /></>;
  return <SideBar/>
};

export default ProtectedRoute;
