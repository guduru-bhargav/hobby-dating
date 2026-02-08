import React from "react";
import "./ProfileMain.css";

function ProfileMain() {
    // Hardcoded user data for now
    const userProfile = {
        first_name: "John",
        age: 28,
        gender: "Male",
        location_city: "San Francisco",
        hobbies: ["Photography", "Music", "Travel"],
        dating_intent: "Serious Relationship",
        profile_photo_main: "https://i.pravatar.cc/300?img=3",
        cover_photo: "https://picsum.photos/800/200", // optional banner
    };

    return (
        <div className="profile-main">
            {/* Cover Photo */}
            <div className="cover-photo">
                <img src={userProfile.cover_photo} alt="Cover" />
            </div>

            {/* Avatar */}
            <div className="avatar-container-Styles">
                <img className="avatar-Styles" src={userProfile.profile_photo_main} alt="Avatar" />
            </div>

            {/* Basic Info */}
            <div className="basic-info">
                <h2>
                    {userProfile.first_name}, {userProfile.age}
                </h2>
                <p>
                    {userProfile.gender} | {userProfile.location_city}
                </p>
            </div>

            {/* Hobbies & Interests */}
            <div className="hobbies-section">
                <h3>Hobbies & Interests</h3>
                <ul>
                    {userProfile.hobbies.map((hobby, index) => (
                        <li key={index}>{hobby}</li>
                    ))}
                </ul>
            </div>

            {/* Dating Intent */}
            <div className="dating-intent">
                <h3>Looking for:</h3>
                <p>{userProfile.dating_intent}</p>
            </div>

            {/* Edit Profile Button */}
            <div className="edit-button-container">
                <button className="btn-edit">Edit Profile</button>
            </div>
        </div>
    );
}

export default ProfileMain;
