import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit2, Download, Trash2, RotateCcw, X } from "lucide-react";
import { packagesPage } from "../../data/packagesData";

type TabType = "active" | "draft" | "deleted";

interface PackagesTableProps {
  tab: TabType;
  searchQuery: string;
}

const contextMenuIcons: Record<string, React.ReactNode> = {
  view: <Eye size={14} />,
  edit: <Edit2 size={14} />,
  download: <Download size={14} />,
  delete: <Trash2 size={14} />,
  restore: <RotateCcw size={14} />,
  "delete-permanently": <Trash2 size={14} />,
};

export function PackagesTable({ tab, searchQuery }: PackagesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredPackages = packagesPage.packages.filter((pkg) => {
    const matchesTab = pkg.status === tab;
    const matchesSearch =
      searchQuery === "" ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const menuActions = packagesPage.contextMenus[tab];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredPackages.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPackages.map((p) => p.id));
    }
  };

  const allSelected =
    filteredPackages.length > 0 && selectedRows.length === filteredPackages.length;

  return (
    <div className="packages-table w-full" data-component="packages-table">
      <table className="packages-table__table w-full border-collapse">
        <thead>
          <tr className="packages-table__header-row bg-[#04706a]">
            <th className="packages-table__th packages-table__th--checkbox w-10 px-4 py-3">
              <input
                type="checkbox"
                className="packages-table__checkbox w-4 h-4 accent-white cursor-pointer"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </th>
            {packagesPage.table.columns
              .filter((c) => c.id !== "select" && c.id !== "actions")
              .map((col) => (
                <th
                  key={col.id}
                  data-col-id={col.id}
                  className="packages-table__th text-left text-white text-sm px-4 py-3 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            <th className="packages-table__th w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {filteredPackages.map((pkg, idx) => (
            <tr
              key={pkg.id}
              data-pkg-id={pkg.id}
              data-pkg-status={pkg.status}
              className={`packages-table__row border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                idx % 2 === 0 ? "packages-table__row--even bg-white" : "packages-table__row--odd bg-white"
              }`}
            >
              {/* Checkbox */}
              <td className="packages-table__td px-4 py-4">
                <input
                  type="checkbox"
                  className="packages-table__checkbox w-4 h-4 accent-[#04706a] cursor-pointer"
                  checked={selectedRows.includes(pkg.id)}
                  onChange={() => toggleRow(pkg.id)}
                  aria-label={`Select ${pkg.title}`}
                />
              </td>

              {/* Package Title */}
              <td className="packages-table__td packages-table__td--title px-4 py-4 text-sm text-[#1a1a1a]">
                {pkg.title}
              </td>

              {/* Code */}
              <td className="packages-table__td packages-table__td--code px-4 py-4 text-sm text-[#374151]">
                {pkg.code}
              </td>

              {/* Duration */}
              <td className="packages-table__td packages-table__td--duration px-4 py-4 text-sm text-[#374151]">
                {pkg.duration}
              </td>

              {/* Destination */}
              <td className="packages-table__td packages-table__td--destination px-4 py-4 text-sm text-[#374151]">
                {pkg.destination}
              </td>

              {/* Type */}
              <td className="packages-table__td packages-table__td--type px-4 py-4 text-sm text-[#374151]">
                {pkg.type}
              </td>

              {/* Last Updated */}
              <td className="packages-table__td packages-table__td--last-updated px-4 py-4 text-sm text-[#374151]">
                <span className="packages-table__edited-label block text-xs text-gray-400">
                  {pkg.lastUpdated.label}
                </span>
                <span className="packages-table__edited-date">
                  {pkg.lastUpdated.date}
                </span>
              </td>

              {/* Actions (3-dot menu) */}
              <td className="packages-table__td packages-table__td--actions px-4 py-4 relative">
                <button
                  className="packages-table__action-btn text-gray-500 hover:text-[#04706a] p-1 rounded hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
                  onClick={() =>
                    setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)
                  }
                  aria-label="More actions"
                  aria-haspopup="true"
                  aria-expanded={openMenuId === pkg.id}
                >
                  <MoreVertical size={18} />
                </button>

                {/* Context Menu Dropdown */}
                {openMenuId === pkg.id && (
                  <div
                    ref={menuRef}
                    className="packages-table__context-menu absolute right-8 top-2 z-50 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[170px]"
                    data-component="context-menu"
                    data-tab={tab}
                    role="menu"
                  >
                    {menuActions.map((action, i) => (
                      <button
                        key={action.id}
                        data-action={action.id}
                        role="menuitem"
                        onClick={() => setOpenMenuId(null)}
                        className={`packages-table__context-menu-item w-full flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-0 text-left transition-colors
                          ${
                            i === 0
                              ? "packages-table__context-menu-item--primary bg-[#04706a] text-white hover:bg-[#035f55]"
                              : "packages-table__context-menu-item--default bg-white text-[#374151] hover:bg-gray-50"
                          }`}
                      >
                        <span className="packages-table__context-menu-icon">
                          {contextMenuIcons[action.id] ?? contextMenuIcons["view"]}
                        </span>
                        <span className="packages-table__context-menu-label">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}

          {filteredPackages.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="packages-table__empty text-center text-gray-400 text-sm py-10"
              >
                No packages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
