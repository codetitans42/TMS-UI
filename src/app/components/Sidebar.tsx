import React from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "../data/packagesData";
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Users,
  Map,
  FileText,
  HeadphonesIcon,
  Settings,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  bookings: <BookOpen size={18} />,
  packages: <Package size={18} />,
  leads: <Users size={18} />,
  itinerary: <Map size={18} />,
  quotation: <FileText size={18} />,
  support: <HeadphonesIcon size={18} />,
  settings: <Settings size={18} />,
};

const pathMap: Record<string, string> = {
  dashboard: "/",
  bookings: "/bookings",
  packages: "/packages",
  leads: "/crm/leads",
  itinerary: "/itinerary",
  quotation: "/quotations",
  support: "/tickets",
  settings: "/settings",
};

export function Sidebar() {
  return (
    <aside className="sidebar fixed left-0 top-0 h-full w-[180px] z-20 flex flex-col" data-component="sidebar">
      {/* Logo area */}
      <div className="sidebar__logo h-[80px] flex items-center px-4 bg-[#eafff9] border-b border-[#04706a]/20 flex-shrink-0">
        <span className="sidebar__logo-icon text-[#04706a]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </span>
      </div>

      {/* Navigation */}
      <nav
        className="sidebar__nav flex-1 bg-gradient-to-b from-[#04706a] to-[#b8cbca] overflow-y-auto py-3 px-2"
        data-component="sidebar-nav"
      >
        <ul className="sidebar__nav-list flex flex-col gap-2 list-none m-0 p-0">
          {navigation.items.map((item) => {
            const path = pathMap[item.id] || "/";
            return (
              <li key={item.id} className="sidebar__nav-item">
                <NavLink
                  to={path}
                  className={({ isActive }) => `sidebar__nav-link w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors cursor-pointer border-0 outline-none
                    ${
                      isActive
                        ? "sidebar__nav-link--active bg-gradient-to-r from-[#04706a] to-[#b8cbca] text-white font-semibold"
                        : "sidebar__nav-link--inactive bg-white/90 text-[#1a1a1a] hover:bg-white"
                    }`}
                >
                  <span className="sidebar__nav-icon flex-shrink-0">
                    {iconMap[item.icon]}
                  </span>
                  <span className="sidebar__nav-label text-sm">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
