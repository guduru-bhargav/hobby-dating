import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SettingsMain.css";
import Icon from "./Icon";
import { supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";

const SUPPORT_EMAIL = "info@hda.com"; // same address shown in the site footer

function SettingsMain({ me, onLogout }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  // Re-check the current password before changing it, so a left-open session can't change it silently
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (form.next === form.current) {
      setError("Choose a password you haven't used here before.");
      return;
    }

    setBusy(true);
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: me.email,
      password: form.current,
    });
    if (verifyError) {
      setBusy(false);
      setError("Your current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: form.next });
    setBusy(false);

    if (updateError) {
      setError(errorMessage(updateError));
      return;
    }
    setForm({ current: "", next: "", confirm: "" });
    setSuccess("Password updated.");
  };

  return (
    <div className="settings-page">
      <header className="view-head">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Account & security</h1>
        </div>
      </header>

      <section className="set-card">
        <h3>Account</h3>
        <div className="set-row">
          <div>
            <span className="set-label">Email</span>
            <strong>{me.email}</strong>
          </div>
        </div>
        <div className="set-row danger-zone">
          <div>
            <span className="set-label">Delete account</span>
            <p>Deleting your account removes your profile, photos and messages. Email us and we'll take care of it.</p>
          </div>
          <a className="btn btn-danger" href={`mailto:${SUPPORT_EMAIL}?subject=Delete my account`}>
            Request deletion
          </a>
        </div>
      </section>

      <section className="set-card">
        <h3>Change password</h3>
        <form className="set-form" onSubmit={handlePasswordChange}>
          <div className="field">
            <label htmlFor="set-current">Current password</label>
            <input id="set-current" className="input" type="password" autoComplete="current-password"
              value={form.current} onChange={(e) => update("current", e.target.value)} required />
          </div>
          <div className="set-grid">
            <div className="field">
              <label htmlFor="set-new">New password</label>
              <input id="set-new" className="input" type="password" autoComplete="new-password"
                value={form.next} onChange={(e) => update("next", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="set-confirm">Confirm new password</label>
              <input id="set-confirm" className="input" type="password" autoComplete="new-password"
                value={form.confirm} onChange={(e) => update("confirm", e.target.value)} required />
            </div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="form-success" role="status">{success}</div>}
          <div>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </section>

      <section className="set-card">
        <h3>Help & safety</h3>
        <ul className="set-links">
          <li><Link to="/contact"><Icon name="mail" size={18} /> Contact support</Link></li>
          <li><Link to="/about"><Icon name="shield" size={18} /> How we keep members safe</Link></li>
        </ul>
      </section>

      <section className="set-card">
        <button type="button" className="btn btn-ghost set-logout" onClick={onLogout}>
          <Icon name="logout" size={18} /> Log out
        </button>
      </section>
    </div>
  );
}

export default SettingsMain;
