import React, { useState } from "react";
import "./ProfileCard.css";

function ProfileCard({
  user,
  age,
  following,
  toggleFollow,
  setSelectedProfile,
}) {
  const [showSecondPhoto, setShowSecondPhoto] = useState(false);

  const handleImageTap = () => {
    setShowSecondPhoto(!showSecondPhoto);
  };

  return (
    <div
      className="profile-card-full"
      onClick={() => setSelectedProfile(user)}
    >
      {/* ✅ Image */}
      <div className="profile-image" onClick={handleImageTap}>
        <img
          src={
            showSecondPhoto
              ? user.photo_2 || user.photo_1
              : user.photo_1 || "https://i.pravatar.cc/600"
          }
          alt={user.first_name}
        />
      </div>

      {/* ✅ Follow Button */}
      <button
        className={`follow-btn-overlay ${
          following.has(user.id) ? "following" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFollow(user.id);
        }}
      >
        {following.has(user.id) ? "Following" : "Follow"}
      </button>

      {/* ✅ Bottom Info */}
      <div className="profile-info-overlay">
        <h3>
          {user.first_name}, {age || "N/A"}
        </h3>
      </div>
    </div>
  );
}

export default ProfileCard;