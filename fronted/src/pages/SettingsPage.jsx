import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function SettingsPage({ user, onProfileUpdated }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/auth/me").then(({ data }) => {
      if (!active) return;
      setFullName(data.user.fullName || "");
      setEmail(data.user.email || "");
      onProfileUpdated?.(data.user);
    }).catch((err) => {
      if (active) setError(err.response?.data?.message || "Could not load your profile.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault(); setMessage(""); setError("");
    try {
      setSaving(true);
      const { data } = await api.patch("/auth/profile", { fullName, email });
      setFullName(data.user.fullName); setEmail(data.user.email);
      onProfileUpdated?.(data.user);
      setMessage(data.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally { setSaving(false); }
  };

  return <div className="space-y-6 max-w-2xl">
    <div><h2 className="text-2xl font-bold text-gray-900">User Profile Settings</h2><p className="text-sm text-gray-500">Update your name and email address.</p></div>
    {loading ? <p className="text-sm text-gray-500">Loading profile...</p> : <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
      {error && <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required minLength="2" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" autoComplete="name" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" autoComplete="email" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <button disabled={saving} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
    </form>}
  </div>;
}
