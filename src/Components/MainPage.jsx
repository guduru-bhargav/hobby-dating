import React, { useEffect, useState } from "react";
import "./MainPage.css";
import ProfileMenu from "./ProfileMenu";
import ChatBox from "./ChatBox";
import { supabase } from "../lib/supabase";

const profiles = [
  { id: 1, name: "Josh", age: 28, image: "https://i.pravatar.cc/300?img=1" },
  { id: 2, name: "Anna", age: 25, image: "https://i.pravatar.cc/300?img=2" },
  { id: 3, name: "Mike", age: 30, image: "https://i.pravatar.cc/300?img=3" },
  { id: 4, name: "Sophia", age: 27, image: "https://i.pravatar.cc/300?img=4" },
  { id: 5, name: "James", age: 29, image: "https://i.pravatar.cc/300?img=5" },
  { id: 6, name: "Emma", age: 26, image: "https://i.pravatar.cc/300?img=6" },
  { id: 7, name: "Josh", age: 28, image: "https://i.pravatar.cc/300?img=1" },
  { id: 8, name: "Anna", age: 25, image: "https://i.pravatar.cc/300?img=2" },
  { id: 9, name: "Mike", age: 30, image: "https://i.pravatar.cc/300?img=3" },
  { id: 10, name: "Sophia", age: 27, image: "https://i.pravatar.cc/300?img=4" },
  { id: 11, name: "James", age: 29, image: "https://i.pravatar.cc/300?img=5" },
  { id: 12, name: "Emma", age: 26, image: "https://i.pravatar.cc/300?img=6" },
  { id: 13, name: "Josh", age: 28, image: "https://i.pravatar.cc/300?img=1" },
  { id: 14, name: "Anna", age: 25, image: "https://i.pravatar.cc/300?img=2" },
  { id: 15, name: "Mike", age: 30, image: "https://i.pravatar.cc/300?img=3" },
  { id: 16, name: "Sophia", age: 27, image: "https://i.pravatar.cc/300?img=4" },
  { id: 17, name: "James", age: 29, image: "https://i.pravatar.cc/300?img=5" },
  { id: 18, name: "Emma", age: 26, image: "https://i.pravatar.cc/300?img=6" },
  { id: 19, name: "Josh", age: 28, image: "https://i.pravatar.cc/300?img=1" },
  { id: 20, name: "Anna", age: 25, image: "https://i.pravatar.cc/300?img=2" },
  { id: 21, name: "Mike", age: 30, image: "https://i.pravatar.cc/300?img=3" },
  { id: 22, name: "Sophia", age: 27, image: "https://i.pravatar.cc/300?img=4" },
  { id: 23, name: "James", age: 29, image: "https://i.pravatar.cc/300?img=5" },
  { id: 24, name: "Emma", age: 26, image: "https://i.pravatar.cc/300?img=6" }
];

function MainPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  // const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  console.log('userProfile', userProfile)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("all_users")
        .select("*")
        .order("created_at", { ascending: false });

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

  return (
    <>
      {/* <Header /> */}

      <div className="main-container">

        {/* Filters */}
        <div className="filters-bar">
          {/* Filters */}
          <div className="filters">
            <select><option>Age</option></select>
            <select><option>City</option></select>
            <select><option>Distance</option></select>
            <select><option>Gender</option></select>
            <select><option>Hobbies</option></select>
            <button className="filter-btn">Apply</button>
          </div>

          {/* Profile Icon */}
          <ProfileMenu />

        </div>


        {/* Profiles Grid */}
        <div className="profiles-scroll">
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div
                className="profile-card"
                key={profile.id}
                onClick={() => setSelectedProfile(users)} // 👈 OPEN CHAT
              >
                <div className="card-image">
                  <img src={profile.image} alt={profile.name} />
                </div>

                <div className="avatar">
                  <img src={profile.image} alt={profile.name} />
                </div>

                <div className="card-info">
                  <h3>{users.full_name || 'Bhargav'}, {profile.age}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="cta">
          <p>Ready to get started?</p>
          <button className="btn-gradient">Get Matched</button>
        </div>

      </div>
      {/* Chat Modal */}
      {selectedProfile && (


        <ChatBox
          profile={selectedProfile}
          currentUser={users} // <-- make sure this is the logged-in user object from Supabase
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}

export default MainPage;
