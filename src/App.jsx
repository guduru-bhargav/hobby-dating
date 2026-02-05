import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/LoginPage';
import Signup from './Components/SignupPage';
import Dashboard from './Components/Dashboard';

import About from './Components/About';
import Services from './Components/Services';
import WhyUs from './Components/WhyUs';
import Contact from './Components/Contact';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
