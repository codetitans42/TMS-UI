import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { PackagesPage } from "./components/packages/PackagesPage";
import { BookingsPage } from "./pages/bookings/BookingsPage";
import { LeadsPage } from "./pages/crm/LeadsPage";
import { ItineraryListPage } from "./pages/itinerary/ItineraryListPage";
import { QuotationsPage } from "./pages/quotes/QuotationsPage";
import { TicketsPage } from "./pages/tickets/TicketsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/crm/leads" element={<LeadsPage />} />
          <Route path="/itinerary" element={<ItineraryListPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
