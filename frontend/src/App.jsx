import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import SideBar from './components/SideBar';
// import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoggedInRoute from './utils/LoggedInRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import SignupPage from './screens/SignupScreen';
import Navbar from './components/Navbar'
import { Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Box marginTop="64px"></Box>
        <Routes>
          <Route element={<LoggedInRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<SignupPage />} />
          </Route>
          {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<SideBar />}>
              <Route path="/home" element={<DashboardScreen />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Route>
          {/* </Route> */}
          <Route path="*" element={
            <div>
              <h1>404 Page not found</h1>
            </div>
          } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
