import React from 'react';

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Acme Corp Organization</h2>
          <p className="text-sm text-gray-500">Manage members, active invitations, and permissions.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Invite Member</button>
      </div>
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Team Members</h3>
        <p className="text-sm text-gray-500">Active membership roles and permission states are rendered here.</p>
      </div>
    </div>
  );
}