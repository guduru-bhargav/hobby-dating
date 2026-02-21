import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { supabase } from "../lib/supabase";

import ProfileMenu from "./ProfileMenu";
import ProfileMain from "./ProfileMain";
import SettingsMain from "./SettingsMain";
import ChatList from "./ChatList";
import FollowList from "./FollowList";
import ChatBox from "./ChatBox";
import BottomNav from "./BottomNav";

function MainPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("follow"); // ✅ default tab
  const [notifications, setNotifications] = useState([]);

  // ✅ Follow system states
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [filters, setFilters] = useState({
    age: "",
    city: "",
    distance: "",
    gender: "",
    hobbies: "",
  });

  // ✅ Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  // ✅ Notifications realtime
  useEffect(() => {
    if (!currentUser?.id) return;

    fetchNotifications();

    const channel = supabase
      .channel("notifications_listener")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser?.id]);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("is_read", false);

    setNotifications(data || []);
  };

  // ✅ Fetch browse users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id;

      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (currentUserId) query = query.neq("user_id", currentUserId);

      const { data, error } = await query;

      if (!error) setUsers(data || []);
    };

    fetchUsers();
  }, []);

  // ✅ Helpers
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const toggleFollow = (id) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApplyFilters = () => {
    console.log("Filters applied:", filters);
    // Later → apply filtering logic
  };

  // ✅ Render middle content
  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <ProfileMain />;

      case "settings":
        return <SettingsMain />;

      case "chat":
        return <ChatList currentUser={currentUser} />;

      case "follow":
      default:
        return (
          <FollowList
            users={users}
            following={following}
            toggleFollow={toggleFollow}
            calculateAge={calculateAge}
            setSelectedProfile={setSelectedProfile}
            selectedProfile={selectedProfile}
            currentUser={currentUser}
            filters={filters}
            setFilters={setFilters}
            handleApplyFilters={handleApplyFilters}
          />
        );
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <ProfileMenu
          unreadCount={notifications.length}
          currentUser={currentUser}
          onNavigate={setActiveView}
          activeView={activeView}
        />
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
      <div className="layout">

        {/* ✅ Bottom Navigation (Mobile Only) */}
        <BottomNav
          activeView={activeView}
          onNavigate={setActiveView}
          unreadCount={notifications.length}
        />
      </div>

      {/* ✅ Global ChatBox (optional if not inside FollowList) */}
      {selectedProfile && (
        <ChatBox
          profile={selectedProfile}
          currentUser={currentUser}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}

export default MainPage;