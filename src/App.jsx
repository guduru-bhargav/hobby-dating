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
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Landing page (logged-in users are sent to /MainPage) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected app: profile and settings now live inside MainPage */}
        <Route
          path="/MainPage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/ProfileMain" element={<Navigate to="/MainPage" replace />} />
        <Route path="/SettingsMain" element={<Navigate to="/MainPage" replace />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
