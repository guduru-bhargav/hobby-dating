import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // make sure you have supabase.js
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    gender: "",
    gender_preference: "",
    location_city: "",
    hobbies: "",
    dating_intent: "",
    profile_photo_main: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign up the user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (authError) throw authError;

      // 2️⃣ Upload profile photo if exists
      let profilePhotoUrl = null;
      if (formData.profile_photo_main) {
        const fileExt = formData.profile_photo_main.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-photos") // create a bucket in Supabase Storage
          .upload(fileName, formData.profile_photo_main);

        if (uploadError) throw uploadError;

        profilePhotoUrl = `${supabase.storageUrl}/object/public/profile-photos/${fileName}`;
      }

      // 3️⃣ Insert profile data into profiles table
      const { error: dbError } = await supabase.from("profiles").insert([
        {
          user_id: authData.user.id,
          first_name: formData.first_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          gender_preference: formData.gender_preference,
          location_city: formData.location_city,
          hobbies: formData.hobbies,
          dating_intent: formData.dating_intent,
          profile_photo_main: profilePhotoUrl,
        },
      ]);

      if (dbError) throw dbError;

      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>

          <div>
            <label>Interested In</label>
            <select
              name="gender_preference"
              value={formData.gender_preference}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
              <option value="everyone">Everyone</option>
            </select>
          </div>

          <div>
            <label>City</label>
            <input
              type="text"
              name="location_city"
              value={formData.location_city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Hobbies</label>
            <input
              type="text"
              name="hobbies"
              placeholder="Photography, Music, Travel..."
              value={formData.hobbies}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Dating Intent</label>
            <select
              name="dating_intent"
              value={formData.dating_intent}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="friendship">Friendship</option>
              <option value="casual">Casual Dating</option>
              <option value="serious">Serious Relationship</option>
            </select>
          </div>

          <div>
            <label>Profile Photo</label>
            <input
              type="file"
              name="profile_photo_main"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
