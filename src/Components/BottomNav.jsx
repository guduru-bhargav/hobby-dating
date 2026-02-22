import React from "react";
import "./BottomNav.css";

function BottomNav({ activeView, onNavigate, unreadCount }) {
  return (
    <div className="bottom-nav">
      <button
        className={activeView === "follow" ? "active" : ""}
        onClick={() => onNavigate("follow")}
      >
        👥
        <span>Follow</span>
      </button>
      <button
        className={activeView === "chat" ? "active" : ""}
        onClick={() => onNavigate("chat")}
      >
        💬
        <span>Chat</span>
        {unreadCount > 0 && <div className="badge">{unreadCount}</div>}
      </button>

        <button
        className={activeView === "settings" ? "active" : ""}
        onClick={() => onNavigate("settings")}
      >
        ⚙
        <span>Settings</span>
      </button>

      <button
        className={activeView === "profile" ? "active" : ""}
        onClick={() => onNavigate("profile")}
      >
        👤
        <span>Profile</span>
      </button>
    </div>
  );
}

export default BottomNav;