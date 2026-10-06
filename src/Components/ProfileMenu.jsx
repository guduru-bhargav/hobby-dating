import React from "react";
import Icon from "./Icon";
import { photoOf } from "../lib/utils";
import { NAV_ITEMS } from "../lib/nav";
import "./ProfileMenu.css";

// Desktop sidebar: brand, the viewer's mini profile, navigation and logout
function ProfileMenu({ profile, unreadCount, activeView, onNavigate, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark"><Icon name="logo" size={16} /></span>
        Cherish
      </div>

      <button type="button" className="sidebar-me" onClick={() => onNavigate("profile")}>
        <img src={photoOf(profile, 1)} alt="" />
        <span>
          <strong>{profile?.first_name || "You"}</strong>
          <small>{profile?.location_city || "Complete your profile"}</small>
        </span>
      </button>

      <nav className="sidebar-nav" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activeView === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
            aria-current={activeView === item.key ? "page" : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
            {item.key === "messages" && unreadCount > 0 && (
              <span className="count-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <button type="button" className="nav-item logout" onClick={onLogout}>
        <Icon name="logout" size={20} />
        <span>Log out</span>
      </button>
    </div>
  );
}

export default ProfileMenu;
