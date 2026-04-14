import React from "react";

export function SettingsPage() {
  return (
    <main className="p-6 max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Settings</h1>
      </div>
      
      <div className="bg-white p-6 border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Currency & Tax Configuration</h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
             <label className="block text-sm text-[#374151] mb-1">Country</label>
             <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option>India</option></select>
          </div>
          <div>
             <label className="block text-sm text-[#374151] mb-1">Currency Code</label>
             <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option>INR</option></select>
          </div>
        </div>
      </div>
    </main>
  );
}
