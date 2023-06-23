import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoggedInRoute from './utils/LoggedInRoute';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<LoggedInRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<SignupScreen />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<DashboardScreen />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>
          <Route path="*" element={
            <div>
              <h1> COMP390011WBEndGame: 404 Page not found</h1>
            </div>
          } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
