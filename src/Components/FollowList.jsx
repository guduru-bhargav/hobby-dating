import React, { useState } from "react";
import ChatBox from "./ChatBox";
import "./FollowList.css";
import Header from "./header";

function FollowList({
  users,
  following,
  toggleFollow,
  calculateAge,
  setSelectedProfile,
  selectedProfile,
  currentUser,
  filters,
  setFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCheckbox = (category, value) => {
    const prevValues = filters[category] || [];
    const updated = prevValues.includes(value)
      ? prevValues.filter((v) => v !== value)
      : [...prevValues, value];

    setFilters({ ...filters, [category]: updated });
  };

  return (
    <>
      {/* ✅ HEADER */}
      {/* ✅ FILTER DROPDOWN */}
      <Header
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        openSection={openSection}
        toggleSection={toggleSection}
        filters={filters}
        handleCheckbox={handleCheckbox}
      />

      {/* ✅ Profiles */}
      <div className="profiles-scroll">
        <div className="profiles-grid">
          {users?.length ? (
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
                      src={user.photo_1 || "https://i.pravatar.cc/300"}
                      alt={user.first_name}
                    />
                  </div>

                  <div className="avatar">
                    <img
                      src={user.photo_2 || "https://i.pravatar.cc/100"}
                      alt={user.first_name}
                    />
                  </div>

                  <div className="card-info">
                    <button
                      className={`follow-btn ${following.has(user.id) ? "following" : ""
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                    >
                      {following.has(user.id) ? "Following" : "Follow"}
                    </button>

                    <h3>
                      {user.first_name}, {age || "N/A"}
                    </h3>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-users">No users found</p>
          )}
        </div>
      </div>

      {/* ✅ Chat */}
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

export default FollowList;