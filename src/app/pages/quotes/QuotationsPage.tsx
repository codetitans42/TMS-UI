import React from "react";
import { Plus, Search } from "lucide-react";

export function QuotationsPage() {
  return (
    <main className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Quotations</h1>
        <button className="flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
          <Plus size={16} /><span>Create New Quote</span>
        </button>
      </div>
      
      <div className="bg-white p-10 border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm text-center">
        <p className="text-gray-500">No quotations generated yet.</p>
      </div>
    </main>
  );
}
