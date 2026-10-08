import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import { supabase } from "../lib/supabase";
import { getProfileByUserId } from "../api/profiles";
import { countUnreadNotifications } from "../api/chat";
import { errorMessage } from "../lib/utils";

import ProfileMenu from "./ProfileMenu";
import BottomNav from "./BottomNav";
import Discover from "./Discover";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ProfileMain from "./ProfileMain";
import ProfileEdit from "./ProfileEdit";
import SettingsMain from "./SettingsMain";

// Views: discover | messages | profile | settings
function MainPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState("discover");
  const [chatTarget, setChatTarget] = useState(null); // profile row of the person being messaged
  const [unread, setUnread] = useState(0);

  // Who is logged in, and their profile row
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) {
          navigate("/login", { replace: true });
          return;
        }
        const { data, error } = await getProfileByUserId(user.id);
        if (error) throw error;
        if (!cancelled) {
          setMe(user);
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err, "Couldn't load your account."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // Unread message badge, kept live by notification inserts and updates
  const refreshUnread = useCallback(async () => {
    if (!me?.id) return;
    try {
      setUnread(await countUnreadNotifications(me.id));
    } catch {
      setUnread(0);
    }
  }, [me?.id]);

  useEffect(() => {
    if (!me?.id) return;
    refreshUnread();
    const channel = supabase
      .channel(`notifications_${me.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${me.id}` },
        refreshUnread
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [me?.id, refreshUnread]);

  const openChat = (otherProfile) => {
    setChatTarget(otherProfile);
    setView("messages");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-loading">
        <div className="form-error" role="alert">{loadError}</div>
      </div>
    );
  }

  // Signed in but no profile row (e.g. signup stopped halfway): finish it first
  if (!profile) {
    return (
      <div className="setup-screen">
        <ProfileEdit
          me={me}
          profile={null}
          onSaved={(row) => setProfile(row)}
          onCancel={handleLogout}
          cancelLabel="Log out"
        />
      </div>
    );
  }

  const isMessages = view === "messages";

  let content;
  if (view === "discover") {
    content = <Discover profile={profile} onMessage={openChat} />;
  } else if (view === "messages") {
    content = (
      <div className={`messages-layout ${chatTarget ? "has-chat" : ""}`}>
        <aside className="messages-list">
          <header className="view-head compact">
            <h1>Messages</h1>
          </header>
          <ChatList
            meId={me.id}
            selectedId={chatTarget?.user_id}
            onSelect={(p) => setChatTarget(p)}
          />
        </aside>
        <div className="messages-chat">
          {chatTarget ? (
            <ChatBox
              key={chatTarget.user_id}
              meId={me.id}
              profile={chatTarget}
              onBack={() => setChatTarget(null)}
              onRead={refreshUnread}
            />
          ) : (
            <div className="chat-placeholder">
              <h3>Select a conversation</h3>
              <p>Pick someone from the list, or message a match from Discover.</p>
            </div>
          )}
        </div>
      </div>
    );
  } else if (view === "profile") {
    content = <ProfileMain me={me} profile={profile} onProfileUpdated={setProfile} />;
  } else {
    content = <SettingsMain me={me} onLogout={handleLogout} />;
  }

  return (
    <div className={`app-shell ${isMessages ? "is-messages" : ""}`}>
      <aside className="app-sidebar">
        <ProfileMenu
          profile={profile}
          unreadCount={unread}
          activeView={view}
          onNavigate={setView}
          onLogout={handleLogout}
        />
      </aside>

      <main className="app-main">
        {content}
      </main>

      <BottomNav activeView={view} onNavigate={setView} unreadCount={unread} />
    </div>
  );
}

export default MainPage;
