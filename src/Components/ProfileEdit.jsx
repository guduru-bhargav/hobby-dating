import React, { useState } from "react";
import { saveProfile } from "../api/profiles";
import {
  CITIES,
  DATING_INTENTS,
  GENDERS,
  GENDER_PREFERENCES,
  HOBBIES,
  MIN_AGE,
} from "../lib/constants";
import {
  calculateAge,
  errorMessage,
  joinHobbies,
  parseHobbies,
  uploadPhoto,
  validatePhoto,
} from "../lib/utils";
import PhotoPicker from "./PhotoPicker";
import "./ProfileEdit.css";

const fromProfile = (p) => ({
  first_name: p?.first_name || "",
  date_of_birth: p?.date_of_birth || "",
  gender: p?.gender || "",
  gender_preference: p?.gender_preference || "",
  location_city: p?.location_city || "",
  dating_intent: p?.dating_intent || "",
  // Keep hobbies that aren't in the preset list, so editing never silently drops them
  hobbies: parseHobbies(p?.hobbies),
});

// Create or edit the viewer's profile. With `profile` null this is the first-time setup form.
function ProfileEdit({ me, profile, onSaved, onCancel, cancelLabel = "Cancel" }) {
  const [form, setForm] = useState(() => fromProfile(profile));
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleHobby = (h) =>
    setForm((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(h) ? prev.hobbies.filter((x) => x !== h) : [...prev.hobbies, h],
    }));

  const validate = () => {
    if (!form.first_name.trim()) return "Please enter your first name.";
    if (!form.date_of_birth) return "Please enter your date of birth.";
    const age = calculateAge(form.date_of_birth);
    if (age === null || age < MIN_AGE) return `You must be at least ${MIN_AGE}.`;
    if (!form.gender) return "Please select your gender.";
    if (!form.gender_preference) return "Please select who you're interested in.";
    if (!form.location_city) return "Please select your city.";
    if (!form.dating_intent) return "Please choose what you're looking for.";
    if (form.hobbies.length === 0) return "Pick at least one hobby.";
    if (!profile && (!photo1 || !photo2)) return "Add two photos to finish your profile.";
    if (photo1 && validatePhoto(photo1)) return validatePhoto(photo1);
    if (photo2 && validatePhoto(photo2)) return validatePhoto(photo2);
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setBusy(true);
    try {
      const fields = {
        first_name: form.first_name.trim(),
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        gender_preference: form.gender_preference,
        location_city: form.location_city,
        dating_intent: form.dating_intent,
        hobbies: joinHobbies(form.hobbies),
      };
      if (photo1) fields.photo_1 = await uploadPhoto(me.id, photo1, "photo_1");
      if (photo2) fields.photo_2 = await uploadPhoto(me.id, photo2, "photo_2");

      const row = await saveProfile(me.id, fields);
      setPhoto1(null);
      setPhoto2(null);
      setSaved(true);
      onSaved?.(row);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="profile-edit" onSubmit={handleSubmit} noValidate>
      <header className="view-head">
        <div>
          <p className="eyebrow">{profile ? "Edit profile" : "Set up your profile"}</p>
          <h1>{profile ? "Make it you" : "Almost there"}</h1>
          {!profile && <p className="pe-sub">Add your details so people know who they're meeting.</p>}
        </div>
      </header>

      <section className="pe-card">
        <h3>Photos</h3>
        <p className="pe-sub">Your first photo is what people see on Discover.</p>
        <div className="photo-grid">
          <PhotoPicker label="Main photo" file={photo1} currentUrl={profile?.photo_1}
            onChange={setPhoto1} onError={setError} />
          <PhotoPicker label="Second photo" file={photo2} currentUrl={profile?.photo_2}
            onChange={setPhoto2} onError={setError} />
        </div>
      </section>

      <section className="pe-card pe-grid">
        <h3>About you</h3>
        <div className="field">
          <label htmlFor="pe-name">First name</label>
          <input id="pe-name" className="input" value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pe-dob">Date of birth</label>
          <input id="pe-dob" className="input" type="date" value={form.date_of_birth}
            onChange={(e) => update("date_of_birth", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pe-gender">I am</label>
          <select id="pe-gender" className="input" value={form.gender}
            onChange={(e) => update("gender", e.target.value)}>
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pe-pref">Interested in</label>
          <select id="pe-pref" className="input" value={form.gender_preference}
            onChange={(e) => update("gender_preference", e.target.value)}>
            <option value="">Select</option>
            {GENDER_PREFERENCES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pe-city">City</label>
          <select id="pe-city" className="input" value={form.location_city}
            onChange={(e) => update("location_city", e.target.value)}>
            <option value="">Select</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pe-intent">Looking for</label>
          <select id="pe-intent" className="input" value={form.dating_intent}
            onChange={(e) => update("dating_intent", e.target.value)}>
            <option value="">Select</option>
            {DATING_INTENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </section>

      <section className="pe-card">
        <h3>Hobbies</h3>
        <p className="pe-sub">Pick what you love. These drive your matches.</p>
        <div className="chip-row">
          {[...new Set([...HOBBIES, ...form.hobbies])].map((h) => {
            const active = form.hobbies.includes(h);
            return (
              <button key={h} type="button" className={`chip chip-select ${active ? "active" : ""}`}
                aria-pressed={active} onClick={() => toggleHobby(h)}>
                {h}
              </button>
            );
          })}
        </div>
      </section>

      {error && <div className="form-error" role="alert">{error}</div>}
      {saved && !error && <div className="form-success" role="status">Profile saved.</div>}

      <div className="pe-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : profile ? "Save changes" : "Finish profile"}
        </button>
      </div>
    </form>
  );
}

export default ProfileEdit;
