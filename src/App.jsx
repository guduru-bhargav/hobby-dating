  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import Login from './Components/LoginPage';
  import Signup from './Components/SignupPage';

  function App() {
    return (
      <Router>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Optional: catch all 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    );
  }

  export default App;
