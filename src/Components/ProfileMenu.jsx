
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./ProfileMenu.css";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(data || null);
    };

    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const img1 = profile?.photo_1 || "https://i.pravatar.cc/100?img=12";
  const img2 = profile?.photo_2 || profile?.photo_1 || "https://i.pravatar.cc/101?img=13";

  return (
    <div className="profile-wrapper">
      <span className="notification-badge">3</span>

      <div className="profile-icon" onClick={() => setOpen(!open)}>
        <img className="primary-img" src={img1} alt="Primary" />
       
        <span className="online-dot"></span>
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatars">
              <img src={img1} alt="p1" />
            </div>
            <div className="dropdown-info">
              <strong>{profile?.first_name || "You"}</strong>
              <small>{profile?.location_city || ""}</small>
            </div>
          </div>

          <button onClick={() => navigate("/ProfileMain")}>Profile</button>
          <button onClick={() => navigate("/SettingsMain")}>Settings</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;

