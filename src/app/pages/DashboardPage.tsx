import React, { useEffect, useState } from "react";

import { dashboardApi, DashboardSummary } from "../services/api";

const EMPTY_SUMMARY: DashboardSummary = {
  totalLeads: 0,
  activePackages: 0,
  totalBookings: 0,
  draftItineraries: 0,
};

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.summary();

        if (!active) {
          return;
        }

        setSummary(data);
        setError(null);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Total Leads", value: summary.totalLeads },
    { label: "Active Packages", value: summary.activePackages },
    { label: "Total Bookings", value: summary.totalBookings },
    { label: "Draft Itineraries", value: summary.draftItineraries },
  ];

  return (
    <main className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Dashboard</h1>
        {error && (
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-[#04706a] underline bg-transparent border-0 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-xl border border-[rgba(6,127,121,0.35)] shadow-sm"
          >
            <h2 className="text-sm font-medium text-gray-500 mb-2">{card.label}</h2>
            <p className="text-3xl font-bold text-[#04706a]">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
