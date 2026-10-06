import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";
import AuthLayout from "./AuthLayout";
import Icon from "./Icon";
import "./Auth.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [hasSession, setHasSession] = useState(null); // null = still checking
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // The recovery link signs the user in briefly; without that session the link has expired
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(errorMessage(updateError));
      return;
    }

    setDone(true);
    await supabase.auth.signOut();
    setTimeout(() => navigate("/login", { replace: true }), 1500);
  };

  let body;
  if (hasSession === null) {
    body = <div className="spinner" aria-label="Loading" />;
  } else if (!hasSession) {
    body = (
      <div className="auth-form">
        <div className="form-error">This reset link has expired or was already used.</div>
        <Link to="/forgot-password" className="btn btn-primary btn-block">Request a new link</Link>
      </div>
    );
  } else if (done) {
    body = <div className="form-success" role="status">Password updated. Redirecting you to login…</div>;
  } else {
    body = (
      <form className="auth-form" onSubmit={handleUpdatePassword}>
        <div className="field">
          <label htmlFor="rp-new">New password</label>
          <div className="input-wrap">
            <Icon name="lock" size={18} />
            <input id="rp-new" className="input" autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-visibility"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
        </div>
        <div className="field">
          <label htmlFor="rp-confirm">Confirm new password</label>
          <div className="input-wrap">
            <Icon name="lock" size={18} />
            <input id="rp-confirm" className="input" autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you haven't used before.">
      {body}
    </AuthLayout>
  );
}

export default ResetPassword;
