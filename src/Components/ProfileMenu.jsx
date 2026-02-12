

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="profile-wrapper">
      {/* Notification Badge */}
      <span className="notification-badge">3</span>

      {/* Profile Icon */}
      <div
        className="profile-icon"
        onClick={() => setOpen(!open)}
      >
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Profile"
        />
        <span className="online-dot"></span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="profile-dropdown">
          <button onClick={() => navigate("/ProfileMain")}>Profile</button>
          <button onClick={() => navigate("/SettingsMain")}>Settings</button>
          <button onClick={() => navigate("/login")}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;

