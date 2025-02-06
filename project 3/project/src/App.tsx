import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import WorkoutCategories from './pages/WorkoutCategories';
import UserInfo from './pages/UserInfo';
import Profile from './pages/Profile';
import AICoach from './pages/AICoach';

function App() {
  const shouldShowNavbar = (pathname: string) => {
    const noNavbarRoutes = ['/', '/login', '/signup', '/user-info'];
    return !noNavbarRoutes.includes(pathname);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<WorkoutCategories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-chat" element={<AICoach />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
