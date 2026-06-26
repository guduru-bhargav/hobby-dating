import React, { useEffect, useState } from "react";
import "./ProfileMain.css";
import { supabase } from "../lib/supabase";

function ProfileMain() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error) setProfile(data);
      else console.error(error);

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <div className="tinder-page">Loading...</div>;
  if (!profile) return <div className="tinder-page">No profile found.</div>;

  const hobbies = Array.isArray(profile.hobbies)
    ? profile.hobbies
    : (profile.hobbies || "")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

  const age = profile.date_of_birth
    ? (() => {
        const bd = new Date(profile.date_of_birth);
        const now = new Date();
        let a = now.getFullYear() - bd.getFullYear();
        const m = now.getMonth() - bd.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) a--;
        return a;
      })()
    : "N/A";

  return (
  <div className="profile-luxury-page">
    {/* Background Image */}
    <div className="profile-hero">
      <img
        src={profile.photo_1 || "https://picsum.photos/800/1200"}
        alt="Profile"
      />
      <div className="hero-overlay" />
    </div>

    {/* Floating Info Panel */}
    <div className="profile-floating-card">
      <div className="profile-header-row">
        <h1>
          {profile.first_name || "User"}, <span>{age}</span>
        </h1>
        <span className="verified-badge">✔</span>
      </div>

      <p className="location">
        {profile.location_city || "Unknown City"}
      </p>

      <p className="bio">
        {profile.bio || "No bio added yet ✨"}
      </p>

      <div className="chips-row">
        {hobbies.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn-pass">Pass</button>
        <button className="btn-like">Like</button>
        <button className="btn-chat">Chat</button>
      </div>
    </div>
  </div>
);
}

export default ProfileMain;