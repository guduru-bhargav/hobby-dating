import React, { useState } from "react";
import "./ProfileMain.css";
import Icon from "./Icon";
import ProfileEdit from "./ProfileEdit";
import { DATING_INTENTS } from "../lib/constants";
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

      <article className="pp-card">
        <div className="pp-cover" style={{ backgroundImage: `url(${photoOf(profile, 1)})` }} />
        <div className="pp-identity">
          <img className="pp-avatar" src={photoOf(profile, 2)} alt={`${profile.first_name} photo`} />
          <div>
            <h2>{profile.first_name}{age !== null ? `, ${age}` : ""}</h2>
            <p className="pp-meta">
              {[profile.gender, profile.location_city].filter(Boolean).join(" · ") || "Add your details"}
            </p>
          </div>
        </div>

        <div className="pp-body">
          {intent && (
            <div className="pp-block">
              <h4>Looking for</h4>
              <span className="pill-soft">{intent}</span>
            </div>
          )}
          <div className="pp-block">
            <h4>Hobbies</h4>
            {hobbies.length ? (
              <div className="chip-row">
                {hobbies.map((h) => <span key={h} className="chip">{h}</span>)}
              </div>
            ) : (
              <p className="pp-muted">No hobbies yet. Add some to get better matches.</p>
            )}
          </div>
        </div>
      </article>

      <section className="pp-complete" aria-label="Profile completeness">
        <div className="pp-complete-row">
          <strong>Profile strength</strong>
          <span>{percent}%</span>
        </div>
        <div className="meter" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${percent}%` }} />
        </div>
        {percent < 100 && <p className="pp-muted">Complete your profile to appear in more searches.</p>}
      </section>
    </div>
  );
}

export default ProfileMain;
