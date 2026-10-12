import React from "react";

export default function DashboardPage({ user }) {
  const name = user?.fullName || user?.email?.split("@")[0] || "there";
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {name}</h2>
        <p className="text-sm text-gray-500">Here is your workflow overview.</p>
      </div>
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900">Your workspace</h3>
        <p className="text-sm text-gray-500 mt-1">Open Projects to view project details or create a new project.</p>
      </div>
    </div>
  );
}
