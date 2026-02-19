import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password", // your route
    });

    if (error) {
      console.error("Reset error:", error.message);
      setMessage(error.message);
    } else {
      setMessage("✅ Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Forgot Password</h2>

        <form onSubmit={handleReset}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}

        <p style={{ marginTop: 10 }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
