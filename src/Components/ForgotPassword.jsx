import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";
import AuthLayout from "./AuthLayout";
import Icon from "./Icon";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    // Use the current origin so the link works on localhost and on the deployed site
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setBusy(false);
    if (resetError) setError(errorMessage(resetError));
    else setSent(true);
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
      footer={<Link to="/login">Back to login</Link>}
    >
      {sent ? (
        <div className="form-success" role="status">
          If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox and spam folder.
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleReset}>
          <div className="field">
            <label htmlFor="fp-email">Email</label>
            <div className="input-wrap">
              <Icon name="mail" size={18} />
              <input id="fp-email" className="input" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
