import React, { useState } from "react";
import ChatBox from "./ChatBox";
import "./FollowList.css";

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
      <div className="follow-header">
        <h2>Hobby Dating</h2>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
         ☰ Filters
        </button>
      </div>

      {/* ✅ FILTER DROPDOWN */}
      {showFilters && (
        <div className="filters-dropdown">
          {/* Age */}
          <div className="filter-section">
            <div onClick={() => toggleSection("age")} className="filter-title">
              Age
            </div>

            {openSection === "age" && (
              <div className="filter-options">
                {["18-25", "26-35", "36-45", "46+"].map((age) => (
                  <label key={age}>
                    <input
                      type="checkbox"
                      checked={(filters.age || []).includes(age)}
                      onChange={() => handleCheckbox("age", age)}
                    />
                    {age}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* City */}
          <div className="filter-section">
            <div onClick={() => toggleSection("city")} className="filter-title">
              City
            </div>

            {openSection === "city" && (
              <div className="filter-options">
                {["Mumbai", "Delhi", "Bangalore", "Hyderabad"].map((city) => (
                  <label key={city}>
                    <input
                      type="checkbox"
                      checked={(filters.city || []).includes(city)}
                      onChange={() => handleCheckbox("city", city)}
                    />
                    {city}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Distance */}
          <div className="filter-section">
            <div
              onClick={() => toggleSection("distance")}
              className="filter-title"
            >
              Distance
            </div>

            {openSection === "distance" && (
              <div className="filter-options">
                {["5 km", "10 km", "25 km", "50 km"].map((distance) => (
                  <label key={distance}>
                    <input
                      type="checkbox"
                      checked={(filters.distance || []).includes(distance)}
                      onChange={() =>
                        handleCheckbox("distance", distance)
                      }
                    />
                    {distance}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="filter-section">
            <div
              onClick={() => toggleSection("gender")}
              className="filter-title"
            >
              Gender
            </div>

            {openSection === "gender" && (
              <div className="filter-options">
                {["Male", "Female", "Non-binary"].map((gender) => (
                  <label key={gender}>
                    <input
                      type="checkbox"
                      checked={(filters.gender || []).includes(gender)}
                      onChange={() => handleCheckbox("gender", gender)}
                    />
                    {gender}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Hobbies */}
          <div className="filter-section">
            <div
              onClick={() => toggleSection("hobbies")}
              className="filter-title"
            >
              Hobbies
            </div>

            {openSection === "hobbies" && (
              <div className="filter-options">
                {["Music", "Travel", "Gaming", "Sports"].map((hobby) => (
                  <label key={hobby}>
                    <input
                      type="checkbox"
                      checked={(filters.hobbies || []).includes(hobby)}
                      onChange={() => handleCheckbox("hobbies", hobby)}
                    />
                    {hobby}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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