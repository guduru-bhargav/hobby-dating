import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1️⃣ Log in user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Login failed. User not found.");
      }

      // 2️⃣ Fetch the user's profile (maybeSingle avoids error if row doesn't exist)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .maybeSingle(); // ✅ changed from .single() to maybeSingle()

      if (profileError) throw profileError;

      console.log("Logged in profile:", profile);

      // 3️⃣ Navigate to dashboard/main page
      navigate("/MainPage");
    } catch (err) {
      setErrorMsg(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Link to="/dashboard" className="auth-logo-link">
        <div className="auth-logo">
          <span className="logo-icon">Hobby Base💕</span>
        </div>
      </Link>

      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {errorMsg && <p style={{ color: "red", marginTop: "8px" }}>{errorMsg}</p>}
        </form>

        <p style={{ marginTop: "12px" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
