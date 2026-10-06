import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { saveProfile } from "../api/profiles";
import {
  CITIES,
  DATING_INTENTS,
  GENDERS,
  GENDER_PREFERENCES,
  HOBBIES,
  MIN_AGE,
} from "../lib/constants";
import { calculateAge, errorMessage, joinHobbies, uploadPhoto, validatePhoto } from "../lib/utils";
import AuthLayout from "./AuthLayout";
import Icon from "./Icon";
import PhotoPicker from "./PhotoPicker";
import "./Auth.css";

const EMPTY_FORM = {
  first_name: "",
  email: "",
  password: "",
  date_of_birth: "",
  gender: "",
  gender_preference: "",
  location_city: "",
  dating_intent: "",
  hobbies: [],
  photo_1: null,
  photo_2: null,
};

// Validate the whole form; returns the first problem as a message, or null
const validateForm = (f) => {
  if (!f.first_name.trim()) return "Please enter your first name.";
  if (!f.email.trim()) return "Please enter your email.";
  if (f.password.length < 8) return "Password must be at least 8 characters.";
  if (!f.date_of_birth) return "Please enter your date of birth.";
  const age = calculateAge(f.date_of_birth);
  if (age === null || age < MIN_AGE) return `You must be at least ${MIN_AGE} to join.`;
  if (!f.gender) return "Please select your gender.";
  if (!f.gender_preference) return "Please select who you're interested in.";
  if (!f.location_city) return "Please select your city.";
  if (!f.dating_intent) return "Please choose what you're looking for.";
  if (f.hobbies.length === 0) return "Pick at least one hobby.";
  const p1 = validatePhoto(f.photo_1);
  if (p1) return `Photo 1: ${p1}`;
  const p2 = validatePhoto(f.photo_2);
  if (p2) return `Photo 2: ${p2}`;
  return null;
};

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("details"); // "details" | "verify"
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleHobby = (hobby) =>
    setForm((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));

  // Upload photos and save the profile row. Needs an active session.
  const finishProfile = async (userId) => {
    const photo_1 = await uploadPhoto(userId, form.photo_1, "photo_1");
    const photo_2 = await uploadPhoto(userId, form.photo_2, "photo_2");

    await saveProfile(userId, {
      first_name: form.first_name.trim(),
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      gender_preference: form.gender_preference,
      location_city: form.location_city,
      dating_intent: form.dating_intent,
      hobbies: joinHobbies(form.hobbies),
      photo_1,
      photo_2,
    });

    navigate("/MainPage", { replace: true });
  };

  // Step 1: create the account with the password, then send the email code
  const handleDetails = async (e) => {
    e.preventDefault();
    setError("");
    const problem = validateForm(form);
    if (problem) {
      setError(problem);
      return;
    }

    setBusy(true);
    const email = form.email.trim();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: { data: { first_name: form.first_name.trim() } },
    });

    if (signUpError) {
      setBusy(false);
      setError(
        /already registered/i.test(signUpError.message)
          ? "An account with this email already exists. Try logging in."
          : errorMessage(signUpError)
      );
      return;
    }

    // Supabase returns no identities when the email is already taken
    if (data.user && data.user.identities?.length === 0) {
      setBusy(false);
      setError("An account with this email already exists. Try logging in.");
      return;
    }

    // Email confirmation turned off: a session already exists
    if (data.session) {
      try {
        await finishProfile(data.user.id);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(false);
    setStep("verify");
    setNotice(`We sent a 6-digit code to ${email}.`);
  };

  // Step 2: confirm the email code, then finish the profile
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!otp.trim()) {
      setError("Enter the code from your email.");
      return;
    }

    setBusy(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token: otp.trim(),
      type: "signup",
    });

    if (verifyError || !data.user) {
      setBusy(false);
      setError("That code is incorrect or has expired. Request a new one.");
      return;
    }

    try {
      await finishProfile(data.user.id);
    } catch (err) {
      setError(`Account verified, but saving your profile failed: ${errorMessage(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setNotice("");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: form.email.trim(),
    });
    if (resendError) setError(errorMessage(resendError));
    else setNotice("A new code is on its way.");
  };

  if (step === "verify") {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="Enter the code we sent to finish creating your account."
        footer={<Link to="/login">Back to login</Link>}
      >
        <form className="auth-form otp-box" onSubmit={handleVerify}>
          <span className="otp-email">{form.email}</span>
          <input
            className="input otp-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
            aria-label="Verification code"
            autoFocus
          />
          {notice && <div className="form-success">{notice}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Creating your profile…" : "Verify and create account"}
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={resendCode} disabled={busy}>
            Resend code
          </button>
          <p className="auth-hint">Wrong email? Go back and edit your details.</p>
          <button
            type="button"
            className="chip-link"
            onClick={() => {
              setStep("details");
              setOtp("");
              setError("");
              setNotice("");
            }}
          >
            ← Edit details
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="A few details help us find people you'll really click with."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleDetails} noValidate>
        <div className="auth-section-title">Account</div>
        <div className="auth-row">
          <div className="field">
            <label htmlFor="su-name">First name</label>
            <input id="su-name" className="input" value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="su-dob">Date of birth</label>
            <input id="su-dob" className="input" type="date" value={form.date_of_birth}
              max={new Date(Date.now() - MIN_AGE * 365.25 * 864e5).toISOString().slice(0, 10)}
              onChange={(e) => update("date_of_birth", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="su-email">Email</label>
          <div className="input-wrap">
            <Icon name="mail" size={18} />
            <input id="su-email" className="input" type="email" autoComplete="email"
              value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="su-password">Password <span style={{ fontWeight: 500, color: "var(--muted)" }}>(min. 8 characters)</span></label>
          <div className="input-wrap">
            <Icon name="lock" size={18} />
            <input id="su-password" className="input" autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={form.password} onChange={(e) => update("password", e.target.value)} />
            <button type="button" className="toggle-visibility"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
        </div>

        <div className="auth-section-title">About you</div>
        <div className="auth-row">
          <div className="field">
            <label htmlFor="su-gender">I am</label>
            <select id="su-gender" className="input" value={form.gender}
              onChange={(e) => update("gender", e.target.value)}>
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="su-pref">Interested in</label>
            <select id="su-pref" className="input" value={form.gender_preference}
              onChange={(e) => update("gender_preference", e.target.value)}>
              <option value="">Select</option>
              {GENDER_PREFERENCES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="su-city">City</label>
            <select id="su-city" className="input" value={form.location_city}
              onChange={(e) => update("location_city", e.target.value)}>
              <option value="">Select</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="su-intent">Looking for</label>
            <select id="su-intent" className="input" value={form.dating_intent}
              onChange={(e) => update("dating_intent", e.target.value)}>
              <option value="">Select</option>
              {DATING_INTENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field-label">Hobbies</span>
          <div className="chip-row">
            {HOBBIES.map((h) => {
              const active = form.hobbies.includes(h);
              return (
                <label key={h} className={`chip chip-select ${active ? "active" : ""}`}>
                  <input type="checkbox" checked={active} onChange={() => toggleHobby(h)} />
                  {h}
                </label>
              );
            })}
          </div>
        </div>

        <div className="auth-section-title">Photos</div>
        <div className="photo-grid">
          <PhotoPicker label="Main photo" file={form.photo_1} onChange={(f) => update("photo_1", f)} onError={setError} />
          <PhotoPicker label="Second photo" file={form.photo_2} onChange={(f) => update("photo_2", f)} onError={setError} />
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Working…" : "Continue"}
        </button>
        <p className="auth-hint">
          By continuing you agree to our terms and confirm you are {MIN_AGE} or older.
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;
