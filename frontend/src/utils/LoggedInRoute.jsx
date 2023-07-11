import React, {useState, useEffect} from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';

// This will prevent the logged in users from having to login again when passing login/register page url
const LoggedInRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem('access_token');
    const token = Cookies.get('loginToken');
    setIsLoggedIn(token);
  }, []);

  return isLoggedIn ? <Navigate to="/home" replace /> : <><Navbar/><Outlet/></>;
};

export default LoggedInRoute;
