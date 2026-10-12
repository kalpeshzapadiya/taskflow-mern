import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = "No records found", description = "Get started by creating a new entry.", actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
        <FolderOpen size={24} />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}