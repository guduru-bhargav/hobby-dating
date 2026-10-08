import React, { useState } from "react";
import { saveProfile } from "../api/profiles";
import {
  CITIES,
  DATING_INTENTS,
  GENDERS,
  GENDER_PREFERENCES,
  HOBBIES,
  MAX_PHOTOS,
  MIN_AGE,
  MIN_PHOTOS,
} from "../lib/constants";
import {
  calculateAge,
  displayPhotoName,
  errorMessage,
  joinHobbies,
  parseHobbies,
  rawPhotos,
  uploadPhoto,
} from "../lib/utils";
import Icon from "./Icon";
import MultiPhotoPicker from "./MultiPhotoPicker";
import "./ProfileEdit.css";

const PIN_RE = /^\d{6}$/;

const fromProfile = (p) => ({
  first_name: p?.first_name || "",
  date_of_birth: p?.date_of_birth || "",
  gender: p?.gender || "",
  gender_preference: p?.gender_preference || "",
  location_city: p?.location_city || "",
  pin_code: p?.pin_code || "",
  dating_intent: p?.dating_intent || "",
  // Keep hobbies that aren't in the preset list, so editing never silently drops them
  hobbies: parseHobbies(p?.hobbies),
});

// The profile's existing photos, as items the multi-photo picker can show and let you remove
const photosFromProfile = (p) =>
  rawPhotos(p).map((url) => ({ id: url, url, name: displayPhotoName(url) }));

// Create or edit the viewer's profile. With `profile` null this is the first-time setup form.
function ProfileEdit({ me, profile, onSaved, onCancel, cancelLabel = "Cancel" }) {
  const [form, setForm] = useState(() => fromProfile(profile));
  const [photos, setPhotos] = useState(() => photosFromProfile(profile));
  const [geo, setGeo] = useState({ status: "idle", lat: null, lng: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleHobby = (h) =>
    setForm((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(h) ? prev.hobbies.filter((x) => x !== h) : [...prev.hobbies, h],
    }));

  const addPhoto = (file) =>
    setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, { id: crypto.randomUUID(), file, name: file.name }]));
  const removePhoto = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeo({ status: "unsupported", lat: null, lng: null });
      return;
    }
    setGeo((g) => ({ ...g, status: "locating" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ status: "done", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeo({ status: "denied", lat: null, lng: null }),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const validate = () => {
    if (!form.first_name.trim()) return "Please enter your first name.";
    if (!form.date_of_birth) return "Please enter your date of birth.";
    const age = calculateAge(form.date_of_birth);
    if (age === null || age < MIN_AGE) return `You must be at least ${MIN_AGE}.`;
    if (!form.gender) return "Please select your gender.";
    if (!form.gender_preference) return "Please select who you're interested in.";
    if (!form.location_city) return "Please select your city.";
    if (!PIN_RE.test(form.pin_code.trim())) return "Please enter a valid 6-digit PIN code.";
    if (!form.dating_intent) return "Please choose what you're looking for.";
    if (form.hobbies.length === 0) return "Pick at least one hobby.";
    if (photos.length < MIN_PHOTOS) return `Add at least ${MIN_PHOTOS} photos.`;
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
        pin_code: form.pin_code.trim(),
        dating_intent: form.dating_intent,
        hobbies: joinHobbies(form.hobbies),
      };
      if (geo.status === "done") {
        fields.latitude = geo.lat;
        fields.longitude = geo.lng;
      }

      // Upload any newly picked photos, keep existing ones as-is, and clear any slot
      // beyond what's left (so removing a photo actually clears it in the database)
      for (let i = 0; i < MAX_PHOTOS; i++) {
        const item = photos[i];
        if (!item) {
          fields[`photo_${i + 1}`] = null;
        } else if (item.file) {
          fields[`photo_${i + 1}`] = await uploadPhoto(me.id, item.file, `photo_${i + 1}`);
        } else {
          fields[`photo_${i + 1}`] = item.url;
        }
      }

      const row = await saveProfile(me.id, fields);
      setPhotos(photosFromProfile(row));
      setSaved(true);
      onSaved?.(row);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const locationHint = {
    idle: profile?.latitude != null ? "Location on file" : null,
    locating: "Finding your location…",
    done: "Location updated ✓",
    denied: "Couldn't get your location — that's fine, it's optional.",
    unsupported: "Location isn't available on this device — that's fine, it's optional.",
  }[geo.status];

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
        <p className="pe-sub">
          Your first photo is what people see on Discover. {MIN_PHOTOS} required — add up to {MAX_PHOTOS}.
        </p>
        <MultiPhotoPicker items={photos} onAdd={addPhoto} onRemove={removePhoto} onError={setError} max={MAX_PHOTOS} />
        <p className="mphoto-hint">
          {photos.length} of {MAX_PHOTOS} added
          {photos.length < MIN_PHOTOS && ` — add ${MIN_PHOTOS - photos.length} more`}
        </p>
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
          <label htmlFor="pe-pin">PIN code</label>
          <input id="pe-pin" className="input" inputMode="numeric" maxLength={6}
            placeholder="e.g. 560001" value={form.pin_code}
            onChange={(e) => update("pin_code", e.target.value.replace(/\D/g, "").slice(0, 6))} />
        </div>
        <div className="field">
          <label htmlFor="pe-intent">Looking for</label>
          <select id="pe-intent" className="input" value={form.dating_intent}
            onChange={(e) => update("dating_intent", e.target.value)}>
            <option value="">Select</option>
            {DATING_INTENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="field">
          <span className="field-label">Location</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={useMyLocation}
            disabled={geo.status === "locating"}>
            <Icon name="pin" size={15} /> {profile?.latitude != null ? "Update my location" : "Use my current location"}
          </button>
          {locationHint && (
            <p className={`mphoto-hint ${geo.status === "done" ? "ok" : ""}`}>
              {geo.status === "done" && <Icon name="check" size={14} strokeWidth={3} />}
              {locationHint}
            </p>
          )}
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
