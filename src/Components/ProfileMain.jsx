import React, { useState } from "react";
import "./ProfileMain.css";
import Icon from "./Icon";
import ProfileEdit from "./ProfileEdit";
import { DATING_INTENTS, GENDERS } from "../lib/constants";
import { calculateAge, parseHobbies, photoOf } from "../lib/utils";

// Fields that make a profile look complete on Discover
const COMPLETENESS = [
  (p) => !!p.first_name,
  (p) => !!p.date_of_birth,
  (p) => !!p.gender,
  (p) => !!p.location_city,
  (p) => !!p.dating_intent,
  (p) => parseHobbies(p.hobbies).length > 0,
  (p) => !!p.photo_1,
  (p) => !!p.photo_2,
];

const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Circular profile-strength meter, shown instead of a plain progress bar
function StrengthRing({ percent }) {
  const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
  return (
    <svg viewBox="0 0 96 96" className="strength-ring" role="img" aria-label={`Profile ${percent}% complete`}>
      <circle cx="48" cy="48" r={RING_RADIUS} className="ring-track" />
      <circle
        cx="48" cy="48" r={RING_RADIUS} className="ring-progress"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
      <text x="48" y="52" textAnchor="middle" className="ring-label">{percent}%</text>
    </svg>
  );
}

function ProfileMain({ me, profile, onProfileUpdated }) {
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState(false);

  if (editing) {
    return (
      <ProfileEdit
        me={me}
        profile={profile}
        onSaved={(row) => {
          onProfileUpdated(row);
          setFlash(true);
          setEditing(false);
          setTimeout(() => setFlash(false), 2500);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  const age = calculateAge(profile.date_of_birth);
  const hobbies = parseHobbies(profile.hobbies);
  const done = COMPLETENESS.filter((check) => check(profile)).length;
  const percent = Math.round((done / COMPLETENESS.length) * 100);
  const intent = DATING_INTENTS.find((d) => d.value === profile.dating_intent)?.label;
  const genderLabel = GENDERS.find((g) => g.value === profile.gender)?.label;
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  const facts = [
    { label: "Gender", value: genderLabel },
    { label: "City", value: profile.location_city },
    { label: "Looking for", value: intent },
    { label: "Member since", value: memberSince },
  ].filter((f) => f.value);

  return (
    <div className="profile-page">
      <header className="view-head">
        <div>
          <p className="eyebrow">My profile</p>
          <h1>How others see you</h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>
          <Icon name="edit" size={16} /> Edit profile
        </button>
      </header>

      {flash && <div className="form-success" role="status">Profile updated.</div>}

      <div className="profile-grid">
        <aside className="profile-hero">
          <div className="profile-hero-bg" style={{ backgroundImage: `url(${photoOf(profile, 1)})` }} />
          <div className="profile-hero-shade" />

          <div className="profile-hero-content">
            <div className="profile-hero-avatar-ring">
              <img className="profile-hero-avatar" src={photoOf(profile, 2)} alt={`${profile.first_name} photo`} />
            </div>
            <h2>{profile.first_name}{age !== null ? <span className="profile-age">, {age}</span> : ""}</h2>
            {profile.location_city && (
              <p className="profile-hero-meta"><Icon name="pin" size={14} /> {profile.location_city}</p>
            )}
            {intent && (
              <span className="profile-intent-badge"><Icon name="heart" size={13} strokeWidth={0} /> {intent}</span>
            )}
          </div>
        </aside>

        <section className="profile-details">
          <article className="detail-card strength-card">
            <StrengthRing percent={percent} />
            <div className="strength-copy">
              <h4>Profile strength</h4>
              <p>
                {percent >= 100
                  ? "Your profile is complete — nice work."
                  : "Finish your profile to appear in more searches."}
              </p>
            </div>
          </article>

          <article className="detail-card">
            <h4>Hobbies</h4>
            {hobbies.length ? (
              <div className="chip-row">
                {hobbies.map((h) => <span key={h} className="chip">{h}</span>)}
              </div>
            ) : (
              <p className="pp-muted">No hobbies yet. Add some to get better matches.</p>
            )}
          </article>

          {facts.length > 0 && (
            <article className="detail-card">
              <h4>About</h4>
              <dl className="profile-facts">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfileMain;
