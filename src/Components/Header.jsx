import React from "react";


function Header({
  showFilters,
  setShowFilters,
  openSection,
  toggleSection,
  filters,
  handleCheckbox,
}) {
  return (
    <>
      {/* ✅ Header */}
      <div className="follow-header">
        <h2>Hobby Dating</h2>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          ☰ Filters
        </button>
      </div>

      {/* ✅ Filters Dropdown */}
      {showFilters && (
        <div className="filters-dropdown">
          {/* Age */}
          <div className="filter-section">
            <div
              onClick={() => toggleSection("age")}
              className="filter-title"
            >
              Age
              <span>{openSection === "age" ? "−" : "+"}</span>
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
            <div
              onClick={() => toggleSection("city")}
              className="filter-title"
            >
              City
              <span>{openSection === "city" ? "−" : "+"}</span>
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
              <span>{openSection === "distance" ? "−" : "+"}</span>
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
              <span>{openSection === "gender" ? "−" : "+"}</span>
            </div>

            {openSection === "gender" && (
              <div className="filter-options">
                {["Male", "Female", "Non-binary"].map((gender) => (
                  <label key={gender}>
                    <input
                      type="checkbox"
                      checked={(filters.gender || []).includes(gender)}
                      onChange={() =>
                        handleCheckbox("gender", gender)
                      }
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
              <span>{openSection === "hobbies" ? "−" : "+"}</span>
            </div>

            {openSection === "hobbies" && (
              <div className="filter-options">
                {["Music", "Travel", "Gaming", "Sports"].map((hobby) => (
                  <label key={hobby}>
                    <input
                      type="checkbox"
                      checked={(filters.hobbies || []).includes(hobby)}
                      onChange={() =>
                        handleCheckbox("hobbies", hobby)
                      }
                    />
                    {hobby}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;