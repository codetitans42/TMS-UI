import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { packagesApi, Package } from "../../services/api";
import { PackagesEmptyState } from "./PackagesEmptyState";
import { PackagesTable } from "./PackagesTable";
import { CreatePackageForm } from "./CreatePackageForm";

type TabType = "active" | "draft" | "deleted";
type ViewType = "list" | "create";

export function PackagesPage() {
  const [view, setView] = useState<ViewType>("list");
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packagesApi.list({ status: activeTab, search: searchQuery });
      setPackages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [activeTab]);

  const handleSave = () => {
    setView("list");
    setActiveTab("active");
    fetchPackages();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPackages();
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "active", label: "Active" },
    { id: "draft", label: "Draft" },
    { id: "deleted", label: "Deleted" },
  ];

  if (view === "create") {
    return (
      <main className="packages-page packages-page--create p-6 max-w-[900px]">
        <div className="packages-page__form-card bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-8">
          <CreatePackageForm
            onBack={() => setView("list")}
            onSave={handleSave}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="packages-page packages-page--list" data-page="packages-list">
      <div className="packages-page__toolbar flex items-center justify-between px-6 pt-4 pb-0 gap-4 flex-wrap">
        <nav className="packages-page__tabs flex items-end gap-0 border-b border-gray-200 flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`packages-page__tab px-5 py-3 text-sm border-b-2 cursor-pointer bg-transparent border-x-0 border-t-0 transition-colors whitespace-nowrap
                  ${isActive
                    ? "packages-page__tab--active border-b-[#04706a] text-[#04706a] font-semibold"
                    : "packages-page__tab--inactive border-b-transparent text-[#374151] hover:text-[#04706a]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <form onSubmit={handleSearch} className="packages-page__search relative">
          <Search size={16} className="packages-page__search-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages..."
            className="packages-page__search-input border border-[#04706a]/50 rounded-full pl-9 pr-4 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 w-[260px]"
          />
        </form>
      </div>

      <div className="packages-page__actions flex justify-end px-6 pt-3 pb-2">
        <button
          className="packages-page__new-btn flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer border-0"
          onClick={() => setView("create")}
        >
          <Plus size={16} />
          <span>New Package</span>
        </button>
      </div>

      <div className="packages-page__content px-6 pb-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-sm flex justify-between">
            <span>{error}</span>
            <button onClick={fetchPackages} className="underline bg-transparent border-0 cursor-pointer">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px] text-gray-400 animate-pulse">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="packages-page__empty-wrap bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm min-h-[400px]">
             <PackagesEmptyState onCreatePackage={() => setView("create")} />
          </div>
        ) : (
          <div className="packages-page__table-wrap bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm overflow-hidden">
            <PackagesTable 
              tab={activeTab} 
              packages={packages} 
              onRefresh={fetchPackages}
            />
          </div>
        )}
      </div>
    </main>
  );
}
