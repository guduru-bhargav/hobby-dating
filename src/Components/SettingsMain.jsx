import React, { useState } from "react";
import "./SettingsMain.css";

function SettingsMain() {
  // Hardcoded user data for UI demonstration
  const [userData, setUserData] = useState({
    email: "john.doe@example.com",
    first_name: "John",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // For now just log the data
    console.log("Password Reset Data:", passwordData);
    alert("Password reset functionality will be implemented later.");
  };

  const handleDeleteAccount = () => {
    alert("Account deletion functionality will be implemented later.");
  };

  return (
    <div className="settings-wrapper">
      <h2>Settings</h2>

      {/* Account Settings */}
      <section className="settings-section">
        <h3>Account Settings</h3>
        <div className="account-setting">
          <label>Email:</label>
          <input type="email" value={userData.email} disabled />
        </div>
        <div className="account-setting">
          <label>First Name:</label>
          <input type="text" value={userData.first_name} disabled />
        </div>
        <button className="btn-danger" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </section>

      {/* Password Reset */}
      <section className="settings-section">
        <h3>Password Reset</h3>
        <form onSubmit={handleResetPassword}>
          <div className="account-setting">
            <label>Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="account-setting">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="account-setting">
            <label>Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Reset Password
          </button>
        </form>
      </section>

      {/* Support / Legal */}
      <section className="settings-section">
        <h3>Support & Legal</h3>
        <ul className="support-list">
          <li>Help / FAQs</li>
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
          <li>Contact Support</li>
        </ul>
      </section>
    </div>
  );
}

export default SettingsMain;
