import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoggedInRoute from './utils/LoggedInRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import SignupPage from './screens/SignupScreen';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<LoggedInRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<DashboardScreen />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
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
