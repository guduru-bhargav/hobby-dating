import React, { useState } from "react";
import ChatBox from "./ChatBox";
import "./FollowList.css";
import ProfileCard from "./ProfileCard";
import HeaderMain from "./HeaderMain"; // ✅ FIX ADDED

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
      <HeaderMain
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        openSection={openSection}
        toggleSection={toggleSection}
        filters={filters}
        handleCheckbox={handleCheckbox}
      />

      {users.map((user) => {
        const age = calculateAge(user.date_of_birth);

        return (
          <ProfileCard
            key={user.id}
            user={user}
            age={age}
            following={following}
            toggleFollow={toggleFollow}
            setSelectedProfile={setSelectedProfile}
          />
        );
      })}

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