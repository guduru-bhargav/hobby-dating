import React, { useEffect, useState } from "react";
import "./ProfileMain.css";
import { supabase } from "../lib/supabase";

function ProfileMain() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
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

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <div className="profile-main">Loading...</div>;

  if (!profile) return <div className="profile-main">No profile found.</div>;

  const hobbies = Array.isArray(profile.hobbies)
    ? profile.hobbies
    : (profile.hobbies || "").split(",").map((s) => s.trim()).filter(Boolean);

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
    <div className="profile-main">
      {/* Cover Photo - use photo_1 as a banner fallback to a placeholder */}
      <div className="cover-photo">
        <img src={profile.photo_1 || profile.cover_photo || "https://picsum.photos/800/200"} alt="Cover" />
      </div>

      {/* Avatar - show photo_2 as requested */}
      <div className="avatar-container-Styles">
        <img className="avatar-Styles" src={profile.photo_2 || profile.photo_1 || "https://i.pravatar.cc/300?img=3"} alt="Avatar" />
      </div>

      {/* Basic Info */}
      <div className="basic-info">
        <h2>{profile.first_name || "User"}, {age}</h2>
        <p className="meta">{profile.gender || ""} {profile.location_city ? `• ${profile.location_city}` : ""}</p>

        <div className="hobbies">
          <h4>Hobbies</h4>
          <ul>
            {hobbies.length ? hobbies.map((h) => (
              <li key={h}>{h}</li>
            )) : <li>Not specified</li>}
          </ul>
        </div>

        <div className="dating-intent">
          <h3>Looking for:</h3>
          <p>{profile.dating_intent || "Not specified"}</p>
        </div>

        <div className="edit-button-container">
          <button className="btn-edit">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileMain;
