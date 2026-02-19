import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

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
    photo_1: null,
    photo_2: null,
  });


  const handleChangePassword = (e) => {
    const { name, value, files, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // First step: Validate form and send OTP
  const handleVerifyAccount = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!formData.first_name.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (!formData.password.trim()) {
      alert("Please enter a password");
      return;
    }
    if (!formData.date_of_birth) {
      alert("Please select date of birth");
      return;
    }
    if (!formData.gender) {
      alert("Please select gender");
      return;
    }
    if (!formData.gender_preference) {
      alert("Please select gender preference");
      return;
    }
    if (!formData.location_city.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!formData.dating_intent) {
      alert("Please select dating intent");
      return;
    }
    if (!formData.photo_1 || !formData.photo_2) {
      alert("Please upload at least 2 photos");
      return;
    }

    // Send OTP
    setOtpLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
    });

    setOtpLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setShowOtpModal(true);
      setOtp("");
    }
  };

  // Second step: Verify OTP and create account
  const handleCreateAccount = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    setVerifyLoading(true);

    try {
      // Verify OTP
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: "email",
      });

      if (otpError) {
        alert("Invalid OTP. Please try again.");
        setVerifyLoading(false);
        return;
      }

      // Get session (after OTP is verified)
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        alert("Session not active. Please try again.");
        setVerifyLoading(false);
        return;
      }

      const user = sessionData.session.user;

      // Upload photos
      try {
        const uploadFile = async (file, nameSuffix) => {
          if (!file) {
            throw new Error(`${nameSuffix} file is missing`);
          }
          if (!file.name) {
            throw new Error(`${nameSuffix} file object is invalid`);
          }

          const ext = file.name.split('.').pop();
          const filePath = `${user.id}/${nameSuffix}_${Date.now()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);

          return urlData.publicUrl;
        };

        const photo1Url = await uploadFile(formData.photo_1, 'photo_1');
        const photo2Url = await uploadFile(formData.photo_2, 'photo_2');

        // Insert profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            first_name: formData.first_name,
            gender: formData.gender,
            location_city: formData.location_city,
            date_of_birth: formData.date_of_birth,
            gender_preference: formData.gender_preference,
            hobbies: formData.hobbies,
            dating_intent: formData.dating_intent,
            photo_1: photo1Url,
            photo_2: photo2Url,
          });

        if (profileError) {
          alert(profileError.message);
          setVerifyLoading(false);
          return;
        }

        // Success - redirect
        setShowOtpModal(false);
        navigate("/MainPage");
      } catch (err) {
        alert('Error: ' + err.message);
        setVerifyLoading(false);
      }
    } catch (err) {
      alert('Error: ' + err.message);
      setVerifyLoading(false);
    }
  };



  return (
    <div className="auth-wrapper">
      <Link to="/dashboard" className="auth-logo-link">
        <div className="auth-logo">
          <div className="logo-text">Hobby Base💕</div>
        </div>
      </Link>



      <div className="auth-container">
        <h2>Sign Up</h2>

        <form onSubmit={handleVerifyAccount} noValidate>

          <div>
            <label>Full name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChangePassword}
              required
            />
          </div>

          <div>
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChangePassword}
              required
            />
          </div>


          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChangePassword}
              required
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChangePassword}
              required
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChangePassword}
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
              onChange={handleChangePassword}
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
              onChange={handleChangePassword}
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
              onChange={handleChangePassword}
            />
          </div>

          <div>
            <label>Dating Intent</label>
            <select
              name="dating_intent"
              value={formData.dating_intent}
              onChange={handleChangePassword}
              required
            >
              <option value="">Select</option>
              <option value="friendship">Friendship</option>
              <option value="casual">Casual Dating</option>
              <option value="serious">Serious Relationship</option>
            </select>
          </div>

          <div>
            <label>Profile Photo 1 (Required)</label>
            <input
              type="file"
              name="photo_1"
              accept="image/*"
              onChange={handleChangePassword}
              required
            />
          </div>

          <div>
            <label>Profile Photo 2 (Required)</label>
            <input
              type="file"
              name="photo_2"
              accept="image/*"
              onChange={handleChangePassword}
              required
            />
          </div>

          <p style={{ fontSize: "12px", color: "#777" }}>
            Upload at least 2 photos to continue
          </p>

          <button type="submit" disabled={otpLoading}>
            {otpLoading ? "Sending OTP..." : "Verify Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verify Your Email</h3>
            <p>OTP received to this email, please verify the OTP</p>

            <div className="modal-email-display">
              <small>{formData.email}</small>
            </div>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="8"
              className="otp-input"
            />

            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                disabled={verifyLoading}
              >
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={handleCreateAccount}
                disabled={verifyLoading}
              >
                {verifyLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
