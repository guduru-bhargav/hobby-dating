import React from "react";
import Icon from "./Icon";
import { NAV_ITEMS } from "../lib/nav";
import "./BottomNav.css";

// Phone navigation. Shares destinations with the desktop sidebar.
function BottomNav({ activeView, onNavigate, unreadCount }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const active = activeView === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={active ? "active" : ""}
            onClick={() => onNavigate(item.key)}
            aria-current={active ? "page" : undefined}
          >
            <span className="bn-icon">
              <Icon name={item.icon} size={22} strokeWidth={active ? 2.4 : 2} />
              {item.key === "messages" && unreadCount > 0 && (
                <span className="bn-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </span>
            <span className="bn-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
