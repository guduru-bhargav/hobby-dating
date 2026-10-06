import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";
import AuthLayout from "./AuthLayout";
import Icon from "./Icon";
import "./Auth.css";

// Turn Supabase's terse auth errors into something a person can act on
const friendlyAuthError = (err) => {
  const msg = err?.message || "";
  if (/invalid login credentials/i.test(msg)) return "Email or password is incorrect.";
  if (/email not confirmed/i.test(msg)) return "Please verify your email before logging in.";
  return errorMessage(err, "Login failed. Please try again.");
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError(friendlyAuthError(authError));
      return;
    }

    navigate("/MainPage", { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your matches and messages."
      footer={
        <>
          New here? <Link to="/signup">Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <div className="input-wrap">
            <Icon name="mail" size={18} />
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>
          <div className="input-wrap">
            <Icon name="lock" size={18} />
            <input
              id="login-password"
              className="input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
          <Link to="/forgot-password" className="auth-inline-link">
            Forgot password?
          </Link>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
