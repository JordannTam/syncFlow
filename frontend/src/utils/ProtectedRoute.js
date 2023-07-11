import React, {useState, useEffect} from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Cookies from 'js-cookie';

// This will protect the admin page from unauthenticated user passing url directly
// const ProtectedRoute = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const setLoggedIn = () => {
//     setIsLoggedIn(true);
//   };

//   useEffect(() => {
//     const token = Cookies.get('loginToken');
//     setLoggedIn();
//   }, []);

//   return !isLoggedIn ? <Navigate to="/login" replace /> : <><SideBar/></>;
//   // return <><SideBar/></>
// };

const ProtectedRoute = () => {
  if (!Cookies.get('loginToken')) {
    return <Navigate to="/login" replace />;
  }
  return <><SideBar/></>;
};

export default ProtectedRoute;