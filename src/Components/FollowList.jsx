import React from "react";
import ChatBox from "./ChatBox";

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
  handleApplyFilters,
}) {
  return (
    <>
      {/* Filters */}
      <div className="filters-bar">
        <div className="filters">
          <select
            value={filters.age}
            onChange={(e) =>
              setFilters({ ...filters, age: e.target.value })
            }
          >
            <option value="">Age</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>

          <select
            value={filters.city}
            onChange={(e) =>
              setFilters({ ...filters, city: e.target.value })
            }
          >
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

          <select
            value={filters.distance}
            onChange={(e) =>
              setFilters({ ...filters, distance: e.target.value })
            }
          >
            <option value="">Distance</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>

          <select
            value={filters.gender}
            onChange={(e) =>
              setFilters({ ...filters, gender: e.target.value })
            }
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>

          <select
            value={filters.hobbies}
            onChange={(e) =>
              setFilters({ ...filters, hobbies: e.target.value })
            }
          >
            <option value="">Hobbies</option>
            <option value="Photography">Photography</option>
            <option value="Music">Music</option>
            <option value="Travel">Travel</option>
            <option value="Sports">Sports</option>
            <option value="Reading">Reading</option>
            <option value="Gaming">Gaming</option>
          </select>

          <button className="filter-btn" onClick={handleApplyFilters}>
            Apply
          </button>
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
                      src={
                        user.photo_1 ||
                        "https://i.pravatar.cc/300?img=1"
                      }
                      alt={user.first_name}
                    />
                  </div>

                  <div className="avatar">
                    <img
                      src={
                        user.photo_2 ||
                        "https://i.pravatar.cc/300?img=1"
                      }
                      alt={user.first_name}
                    />
                  </div>

                  <div className="card-info">
                    <button
                      className={`follow-btn ${
                        following.has(user.id) ? "following" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                      aria-pressed={following.has(user.id)}
                    >
                      {following.has(user.id)
                        ? "Following"
                        : "Follow"}
                    </button>

                    <h3>
                      {user.first_name}, {age || "N/A"}
                    </h3>
                  </div>
                </div>
              );
            })
          ) : (
            <p
              style={{
                color: "#666",
                textAlign: "center",
                padding: "20px",
              }}
            >
              No users found
            </p>
          )}
        </div>
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

export default FollowList;