import React from 'react';
import { Search, Bell, Building2, ChevronDown } from 'lucide-react';

export default function Navbar({ currentOrg = "Acme Corp" }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects, tasks, or users..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">
          <Building2 size={16} className="text-gray-500" />
          <span>{currentOrg}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}