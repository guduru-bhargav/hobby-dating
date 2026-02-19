import React, { useEffect, useState } from "react";
import "./MainPage.css";
import ProfileMenu from "./ProfileMenu";
import ChatBox from "./ChatBox";
import { supabase } from "../lib/supabase";

function MainPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  // const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [filters, setFilters] = useState({
    age: "",
    city: "",
    distance: "",
    gender: "",
    hobbies: ""
  });
   const [currentUser, setCurrentUser] = useState(null);
   const [notifications, setNotifications] = useState([]);


   useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

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

          alert("💬 New message received!");
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser?.id]);

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

  if (!error) {
    setNotifications(data || []);
  }
};



  // Helper function to calculate age from date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      // Exclude the logged-in user's profile from the browse list
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id;

      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (currentUserId) {
        query = query.neq("user_id", currentUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);


  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;
      console.log('user', user);


      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        setUserProfile(profile);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleFollow = (id) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    console.log("Toggled follow for", id);
  };

  const handleApplyFilters = () => {
    console.log("Filters applied:", filters);
    // Add filtering logic here to filter the users array based on selected filters
    // This can be enhanced to actually filter the profiles array
  };

  return (
    <>
      {/* <Header /> */}

      <div className="main-container">

        {/* Filters */}
        <div className="filters-bar">
          {/* Filters */}
          <div className="filters">
            <select value={filters.age} onChange={(e) => setFilters({...filters, age: e.target.value})}>
              <option value="">Age</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46+">46+</option>
            </select>

            <select value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})}>
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

            <select value={filters.distance} onChange={(e) => setFilters({...filters, distance: e.target.value})}>
              <option value="">Distance</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>

            <select value={filters.gender} onChange={(e) => setFilters({...filters, gender: e.target.value})}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>

            <select value={filters.hobbies} onChange={(e) => setFilters({...filters, hobbies: e.target.value})}>
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

          {/* Profile Icon */}
          <ProfileMenu unreadCount={notifications.length}/>

        </div>


        {/* Profiles Grid */}
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

      

      </div>
      {selectedProfile && (


        <ChatBox
          profile={selectedProfile}
          currentUser={currentUser} // <-- make sure this is the logged-in user object from Supabase
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}

export default MainPage;
