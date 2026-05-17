import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";
import EmptyState from "../components/EmptyState";
import usePageTitle from "../hooks/usePageTitle";

function Profile() {
  const { user, updateUser } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  usePageTitle("Profile");

  const [name, setName] = useState(user ? user.name : "");
  const [hostel, setHostel] = useState(user ? user.hostel : "");
  const [roomNo, setRoomNo] = useState(user ? user.roomNo : "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon="🔒"
          title="Please log in"
          subtitle="You need to be logged in to view your profile."
          action={
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);
    try {
      const res = await axios.put("/api/auth/profile", {
        name,
        hostel,
        roomNo,
      });
      if (updateUser) {
        updateUser(res.data);
      }
      setProfileMsg("Profile updated successfully!");
    } catch (err) {
      setProfileErr(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwErr("");
    setSavingPw(true);
    try {
      const res = await axios.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPwMsg(res.data?.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwErr(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setSavingPw(false);
    }
  };

  const inputClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
  }`;
  const labelClass = `block text-sm font-medium mb-1 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const cardClass = `rounded-2xl shadow-lg p-6 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } py-12`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {user.name}
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {user.mobile}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Edit profile */}
          <div className={cardClass}>
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Edit Profile
            </h2>
            {profileMsg && (
              <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-sm">
                {profileMsg}
              </div>
            )}
            {profileErr && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg text-sm">
                {profileErr}
              </div>
            )}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Roll Number</label>
                  <input
                    className={`${inputClass} opacity-60 cursor-not-allowed`}
                    value={user.rollNo}
                    disabled
                  />
                </div>
                <div>
                  <label className={labelClass}>Mobile</label>
                  <input
                    className={`${inputClass} opacity-60 cursor-not-allowed`}
                    value={user.mobile}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hostel</label>
                  <input
                    className={inputClass}
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Room Number</label>
                  <input
                    className={inputClass}
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className={cardClass}>
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Change Password
            </h2>
            {pwMsg && (
              <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-sm">
                {pwMsg}
              </div>
            )}
            {pwErr && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg text-sm">
                {pwErr}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Must be at least 6 characters.
                </p>
              </div>
              <button
                type="submit"
                disabled={savingPw}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60"
              >
                {savingPw ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
