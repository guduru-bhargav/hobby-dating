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
      // 1️⃣ Log in user
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      // ✅ Correct logging
      console.log("LOGIN DATA:", authData);
      console.log("LOGIN ERROR:", authError);

      if (authError) throw authError;

      if (!authData?.user) {
        throw new Error("Login failed. User not found.");
      }

      // 2️⃣ Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      console.log("Logged in profile:", profile);

      // Optional: handle missing profile
      if (!profile) {
        console.warn("Profile not found for user");
        // You could auto-create profile here if needed
      }

      // 3️⃣ Navigate
      navigate("/MainPage");

    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Login failed");
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

          {errorMsg && (
            <p style={{ color: "red", marginTop: "8px" }}>
              {errorMsg}
            </p>
          )}
        </form>

        <p style={{ marginTop: "12px" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p>
  <Link to="/forgot-password">Forgot Password?</Link>
</p>

      </div>
    </div>
  );
}

export default Login;
