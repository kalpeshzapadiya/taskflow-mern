import React from 'react';

export default function TaskDetailPage() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">KT-1024</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Implement authentication with refresh token mechanism</h2>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">High</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</h4>
            <p className="text-sm text-gray-700">Build secure JWT token handling with automatic refresh token fallback and secure HTTP-only cookies.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Comments (4)</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                <p className="font-semibold text-xs text-gray-900">Sarah Wilson • <span className="text-gray-400 font-normal">2 hours ago</span></p>
                <p className="text-gray-600 mt-1">Make sure to validate expiry times against server clocks.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl space-y-4 border">
          <div>
            <p className="text-xs text-gray-500">Assignee</p>
            <p className="text-sm font-semibold text-gray-800">John Doe</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="text-sm font-semibold text-gray-800">Jan 22, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
