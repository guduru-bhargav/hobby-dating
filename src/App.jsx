import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/LoginPage";
import Signup from "./Components/SignupPage";
import Dashboard from "./Components/Dashboard";

import About from "./Components/About";
import Services from "./Components/Services";
import WhyUs from "./Components/WhyUs";
import Contact from "./Components/Contact";
import MainPage from "./Components/MainPage";

import ProtectedRoute from "./Components/ProtectedRoute";
import ProfileMain from "./Components/ProfileMain";
import SettingsMain from "./Components/SettingsMain";

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public Dashboard (landing page) */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Protected routes - only accessible after login */}
        <Route
          path="/MainPage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfileMain"
          element={
            <ProtectedRoute>
              <ProfileMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SettingsMain"
          element={
            <ProtectedRoute>
              <SettingsMain />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
