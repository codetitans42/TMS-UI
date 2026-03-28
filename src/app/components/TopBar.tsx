import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Globe, Plus, Bell, ChevronDown } from "lucide-react";
import { pageConfig } from "../data/packagesData";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/bookings": "Bookings",
  "/packages": "Packages",
  "/crm/leads": "Leads",
  "/itinerary": "Itinerary",
  "/quotations": "Quotation",
  "/tickets": "Support",
  "/settings": "Settings",
};

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "GuestHives";

  return (
    <header
      className="topbar fixed top-0 left-0 right-0 h-[80px] bg-[#eafff9] border-b border-[#04706a] z-30 flex items-center justify-between px-6"
      data-component="topbar"
    >
      {/* Left — hamburger */}
      <div className="topbar__left flex items-center gap-4">
        <button
          className="topbar__menu-btn text-[#04706a] p-1 rounded hover:bg-[#04706a]/10 cursor-pointer border-0 bg-transparent"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Center — dynamic page title */}
      <div className="topbar__center absolute left-1/2 -translate-x-1/2">
        <h1 className="topbar__title text-[#04706a] text-2xl m-0 p-0">{title}</h1>
      </div>

      {/* Right — date, actions, avatar */}
      <div className="topbar__right flex items-center gap-4">
        {/* Date */}
        <div className="topbar__date flex flex-col items-end">
          <button className="topbar__date-toggle flex items-center gap-1 text-[#686868] text-sm bg-transparent border-0 cursor-pointer p-0">
            <span>{pageConfig.date.label}</span>
            <ChevronDown size={16} />
          </button>
          <span className="topbar__date-value text-[#686868] text-sm">{pageConfig.date.value}</span>
        </div>

        {/* Bell */}
        <button className="topbar__bell text-[#04706a] p-1 hover:bg-[#04706a]/10 rounded cursor-pointer border-0 bg-transparent" aria-label="Notifications">
          <Bell size={22} />
        </button>

        {/* Plus */}
        <button
          className="topbar__add-btn text-[#04706a] p-1 hover:bg-[#04706a]/10 rounded cursor-pointer border-0 bg-transparent"
          aria-label="Create new"
        >
          <Plus size={22} />
        </button>

        {/* Globe */}
        <button className="topbar__globe text-[#04706a] p-1 hover:bg-[#04706a]/10 rounded cursor-pointer border-0 bg-transparent" aria-label="Language">
          <Globe size={22} />
        </button>

        {/* Avatar */}
        <div className="topbar__avatar w-10 h-10 rounded-full bg-[#04706a]/20 overflow-hidden flex items-center justify-center">
          <span className="topbar__avatar-initials text-[#04706a] text-sm font-medium">AD</span>
        </div>
      </div>
    </header>
  );
}

