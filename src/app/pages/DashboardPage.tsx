import React from "react";

export function DashboardPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[rgba(6,127,121,0.35)] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-[#04706a]">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[rgba(6,127,121,0.35)] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Packages</h3>
          <p className="text-3xl font-bold text-[#04706a]">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[rgba(6,127,121,0.35)] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Quotes</h3>
          <p className="text-3xl font-bold text-[#04706a]">18</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[rgba(6,127,121,0.35)] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Bookings</h3>
          <p className="text-3xl font-bold text-[#04706a]">7</p>
        </div>
      </div>
    </div>
  );
}
