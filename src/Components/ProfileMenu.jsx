import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./ProfileMenu.css";

function ProfileMenu({ unreadCount, currentUser, onNavigate, activeView }) {
  const [profile, setProfile] = useState(null);

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
    window.location.href = "/login";
  };

  const img1 = profile?.photo_1 || "https://i.pravatar.cc/100?img=12";

  return (
    <div className="profile-wrapper">
      <div className="sidebar-header">
        <div className="profile-icon">
          <img className="primary-img" src={img1} alt="Profile" />
          <span className="online-dot"></span>

          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>

        <h2 className="sidebar-title">
          {profile?.first_name || "User"}
        </h2>
      </div>

      <nav className="sidebar-menu">

        <button
          className={activeView === "follow" ? "active" : ""}
          onClick={() => onNavigate("follow")}
        >
          ❤️ Follow
        </button>

        <button
          className={activeView === "chat" ? "active" : ""}
          onClick={() => onNavigate("chat")}
        >
          💬 Chat
        </button>

        <button
          className={activeView === "profile" ? "active" : ""}
          onClick={() => onNavigate("profile")}
        >
          👤 Profile
        </button>

        <button
          className={activeView === "settings" ? "active" : ""}
          onClick={() => onNavigate("settings")}
        >
          ⚙ Settings
        </button>

        <button className="logout" onClick={handleLogout}>
          🚪 Logout
        </button>

      </nav>
    </div>
  );
}

export default ProfileMenu;