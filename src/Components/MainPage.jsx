import React, { useEffect, useState } from "react";
import "./MainPage.css";
import ProfileMenu from "./ProfileMenu";
import ChatBox from "./ChatBox";
import { supabase } from "../lib/supabase";

function MainPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [filters, setFilters] = useState({
    age: "",
    city: "",
    distance: "",
    gender: "",
    hobbies: ""
  });

  // ✅ Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  // ✅ Realtime notifications
  useEffect(() => {
    if (!currentUser?.id) return;

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
        (payload) => {
          console.log("🔔 New notification:", payload.new);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser?.id]);

  // ✅ Fetch notifications
  useEffect(() => {
    if (!currentUser?.id) return;
    fetchNotifications();
  }, [currentUser?.id]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("is_read", false);

    if (!error) setNotifications(data || []);
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

      if (!error) setUsers(data);
    };

    fetchUsers();
  }, []);

  // ✅ Fetch own profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserProfile(profile);
    };

    fetchUserProfile();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
    // Add filtering logic here to filter the users array based on selected filters
    // This can be enhanced to actually filter the profiles array
  };

  return (
    <>
      <div className="layout">
        <aside className={"sidebar"}>
          <nav className="sidebar-menu">
            <ProfileMenu unreadCount={notifications.length} currentUser={currentUser} />
          </nav>
        </aside>

        {/* ✅ Main Content */}
        <main className="main-container">

          {/* Filters */}
          <div className="filters-bar">
            <div className="filters">
              <select value={filters.age} onChange={(e) => setFilters({ ...filters, age: e.target.value })}>
                <option value="">Age</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46+">46+</option>
              </select>

              <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
                <option value="">City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Indore">Indore</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Surat">Surat</option>
                <option value="Kochi">Kochi</option>
              </select>

              <select value={filters.distance} onChange={(e) => setFilters({ ...filters, distance: e.target.value })}>
                <option value="">Distance</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>

              <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>

              <select value={filters.hobbies} onChange={(e) => setFilters({ ...filters, hobbies: e.target.value })}>
                <option value="">Hobbies</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
                <option value="Travel">Travel</option>
                <option value="Sports">Sports</option>
                <option value="Reading">Reading</option>
                <option value="Gaming">Gaming</option>
              </select>

              <button className="filter-btn" onClick={handleApplyFilters}>Apply</button>
            </div>
          </div>

          {/* Profiles */}
          <div className="profiles-scroll">
            <div className="profiles-grid">
              {users && users.length > 0 ? (
                users.map((user) => {
                  const age = calculateAge(user.date_of_birth);
                  return (
                    <div
                      className="profile-card"
                      key={user.id}
                      onClick={() => setSelectedProfile(user)}
                    >
                      <div className="card-image">
                        <img
                          src={user.photo_1 || "https://i.pravatar.cc/300?img=1"}
                          alt={user.first_name}
                        />
                      </div>

                      <div className="avatar">
                        <img
                          src={user.photo_2 || "https://i.pravatar.cc/300?img=1"}
                          alt={user.first_name}
                        />
                      </div>

                      <div className="card-info">
                        <button
                          className={`follow-btn ${following.has(user.id) ? 'following' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(user.id);
                          }}
                          aria-pressed={following.has(user.id)}
                          aria-label={following.has(user.id) ? 'Unfollow' : 'Follow'}
                        >
                          {following.has(user.id) ? 'Following' : 'Follow'}
                        </button>
                        <h3>{user.first_name}, {age || 'N/A'}</h3>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
                  No users found
                </p>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Chat */}
      {selectedProfile && (
        <ChatBox
          profile={selectedProfile}
          currentUser={currentUser}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}

export default MainPage;
