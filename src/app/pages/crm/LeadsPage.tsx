import React, { useState, useRef, useEffect } from "react";
import {
  Search, Calendar, Plus, MoreVertical,
  Eye, Edit2, FileText, Trash2, ChevronDown, X, ArrowLeft
} from "lucide-react";
import { leadsApi, Lead } from "../../services/api";

type PageView = "list" | "create" | "edit" | "view";

const TRAVEL_TYPES = ["Domestic", "International", "Group", "Honeymoon"];
const LEAD_SOURCES = ["Website", "WhatsApp", "Referral", "Call", "Instagram", "Facebook"];

// ─── Context Menu ─────────────────────────────────────────────────────────────
interface CtxMenuProps {
  leadId: number;
  onView: () => void;
  onEdit: () => void;
  onConvert: () => void;
  onDelete: () => void;
  onClose: () => void;
}
function ContextMenu({ leadId, onView, onEdit, onConvert, onDelete, onClose }: CtxMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-10 top-2 z-50 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[180px]"
      role="menu"
    >
      <button role="menuitem" onClick={() => { onView(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm bg-[#04706a] text-white hover:bg-[#035f55] cursor-pointer border-0 text-left">
        <Eye size={14} /><span>View Detail</span>
      </button>
      <button role="menuitem" onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 cursor-pointer border-0 bg-white text-left">
        <Edit2 size={14} /><span>Edit</span>
      </button>
      <button role="menuitem" onClick={() => { onConvert(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 cursor-pointer border-0 bg-white text-left">
        <FileText size={14} /><span>Convert to Quote</span>
      </button>
      <button role="menuitem" onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-0 bg-white text-left">
        <Trash2 size={14} /><span>Delete</span>
      </button>
    </div>
  );
}

// ─── Lead Detail View ─────────────────────────────────────────────────────────
function LeadDetailView({ lead, onBack, onEdit }: { lead: Lead; onBack: () => void; onEdit: () => void }) {
  return (
    <div className="max-w-[900px]">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0">
        <ArrowLeft size={16} /><span>Back to Leads</span>
      </button>
      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#1a1a1a]">{lead.name}</h2>
            <p className="text-xs text-gray-400">Lead ID: #{lead.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold
              ${lead.status === "New" ? "bg-blue-100 text-blue-700" :
                lead.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                lead.status === "Converted" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-600"}`}>{lead.status}</span>
            <button onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm cursor-pointer border-0">
              <Edit2 size={14} /><span>Edit</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {[
            { label: "Email", value: lead.email },
            { label: "Phone", value: lead.phone },
            { label: "Destination", value: lead.destination },
            { label: "Travel Type", value: lead.travelType },
            { label: "Travel Date", value: lead.travelDate },
            { label: "No. of Travelers", value: String(lead.travelers) },
            { label: "Budget", value: lead.budget },
            { label: "Lead Source", value: lead.leadSource },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-medium text-[#1a1a1a]">{value || "—"}</p>
            </div>
          ))}
          {lead.notes && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-[#374151] whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lead Form ────────────────────────────────────────────────────────────────
interface LeadFormProps {
  initial?: Partial<Lead>;
  onCancel: () => void;
  onSubmit: (data: Partial<Lead>) => void;
  mode: "create" | "edit";
}
function LeadForm({ initial = {}, onCancel, onSubmit, mode }: LeadFormProps) {
  const [name, setName] = useState(initial.name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [travelDate, setTravelDate] = useState(initial.travelDate ? initial.travelDate.split('T')[0] : "");
  const [duration, setDuration] = useState(initial.duration ?? "");
  const [destination, setDestination] = useState(initial.destination ?? "");
  const [travelType, setTravelType] = useState(initial.travelType ?? "");
  const [travelers, setTravelers] = useState(String(initial.travelers ?? ""));
  const [budget, setBudget] = useState(initial.budget ?? "");
  const [leadSource, setLeadSource] = useState(initial.leadSource ?? "");
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    if (!destination.trim()) e.destination = "Destination is required";
    if (!travelers || isNaN(Number(travelers))) e.travelers = "No. of Travelers is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({
      name, phone, email, travelDate, destination, travelType,
      travelers: Number(travelers), budget, leadSource, notes, duration
    });
  };

  const inputClass = (field?: string) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white placeholder-gray-300 ${errors[field ?? ""] ? "border-red-400" : "border-gray-200"}`;

  return (
    <div className="max-w-[900px]">
      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#04706a]">{mode === "create" ? "New Lead" : "Edit Lead"}</h2>
        </div>

        <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className={inputClass("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <div className={`flex items-center border rounded-lg overflow-hidden ${errors.phone ? "border-red-400" : "border-gray-200"} focus-within:ring-2 focus-within:ring-[#04706a]/30 focus-within:border-[#04706a]`}>
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 bg-gray-50 text-sm text-gray-600 shrink-0">
                <span>🇮🇳</span><span className="text-xs">+91</span><ChevronDown size={12} />
              </div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="flex-1 px-3 py-2.5 text-sm text-[#374151] focus:outline-none bg-white placeholder-gray-300" />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email ID" className={inputClass()} />
          </div>

          <div className="relative">
            <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className={`${inputClass()} pr-10`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold">*</span>
          </div>

          <div className="relative">
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Set Duration (e.g. 5 Nights)" className={`${inputClass()} pr-10`} />
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className={inputClass("destination")} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold">*</span>
            {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
          </div>

          <div className="relative">
            <select value={travelType} onChange={(e) => setTravelType(e.target.value)} className={`${inputClass()} appearance-none cursor-pointer`}>
              <option value="">Travel Type</option>
              {TRAVEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(e.target.value)} placeholder="No. of Travelers" className={inputClass("travelers")} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold">*</span>
            {errors.travelers && <p className="text-xs text-red-500 mt-1">{errors.travelers}</p>}
          </div>

          <div>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget" className={inputClass()} />
          </div>

          <div className="relative">
            <select value={leadSource} onChange={(e) => setLeadSource(e.target.value)} className={`${inputClass()} appearance-none cursor-pointer`}>
              <option value="">Lead Source</option>
              {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="col-span-2">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white placeholder-gray-300 resize-none" />
          </div>
        </div>

        <div className="px-8 pb-8 grid grid-cols-2 gap-6">
          <button onClick={onCancel} className="w-full py-3 border border-[#04706a] text-[#04706a] rounded-lg text-sm font-medium hover:bg-[#04706a]/5 cursor-pointer bg-white">Cancel</button>
          <button onClick={handleSubmit} className="w-full py-3 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer border-0">
            {mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Leads Page ──────────────────────────────────────────────────────────
export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<PageView>("list");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const refreshLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.list();
      setLeads(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshLeads(); }, []);

  const handleCreate = async (data: Partial<Lead>) => {
    try {
      await leadsApi.create(data);
      setView("list");
      refreshLeads();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = async (data: Partial<Lead>) => {
    if (!selectedLead) return;
    try {
      await leadsApi.update(selectedLead.id, data);
      setView("list");
      setSelectedLead(null);
      refreshLeads();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsApi.delete(id);
      refreshLeads();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const filtered = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return !q || l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone.includes(q);
  });

  if (view === "create") {
    return (
      <main className="p-6">
        <LeadForm mode="create" onCancel={() => setView("list")} onSubmit={handleCreate} />
      </main>
    );
  }
  if (view === "edit" && selectedLead) {
    return (
      <main className="p-6">
        <LeadForm mode="edit" initial={selectedLead} onCancel={() => { setView("list"); setSelectedLead(null); }} onSubmit={handleEdit} />
      </main>
    );
  }
  if (view === "view" && selectedLead) {
    return (
      <main className="p-6">
        <LeadDetailView lead={selectedLead} onBack={() => { setView("list"); setSelectedLead(null); }} onEdit={() => setView("edit")} />
      </main>
    );
  }

  return (
    <main className="leads-page p-6" data-page="leads">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Name, Email or Phone" className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white" />
        </div>
        <div className="relative"><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-500" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">From</span></div>
        <div className="relative"><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-500" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">To</span></div>
        <button onClick={() => setView("create")} className="flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer border-0 whitespace-nowrap"><Plus size={16} /><span>New Lead</span></button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refreshLeads} className="underline font-semibold bg-transparent border-0 cursor-pointer">Retry</button>
        </div>
      )}

      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse">Loading leads...</div>
        ) : (
          <table className="w-full border-collapse" data-component="leads-table">
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #04706a 0%, #b8cbca 100%)" }} className="text-white text-sm">
                <th className="w-10 px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-white cursor-pointer" /></th>
                <th className="text-left px-4 py-3 font-semibold">Lead Name</th>
                <th className="text-left px-4 py-3 font-semibold">Contact Info</th>
                <th className="text-left px-4 py-3 font-semibold">Destination</th>
                <th className="text-left px-4 py-3 font-semibold">Travel Type</th>
                <th className="text-left px-4 py-3 font-semibold">Travel Date</th>
                <th className="text-left px-4 py-3 font-semibold">Travelers</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={8} className="text-center text-gray-400 text-sm py-16">No leads found in database.</td></tr>
              )}
              {filtered.map((lead, idx) => (
                <tr key={lead.id} className={`border-b border-gray-100 hover:bg-[#f0fafa] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                  <td className="px-4 py-4"><input type="checkbox" className="w-4 h-4 accent-[#04706a] cursor-pointer" /></td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#1a1a1a]">{lead.name}</td>
                  <td className="px-4 py-4"><span className="block text-sm text-[#374151]">{lead.email}</span><span className="block text-xs text-gray-400 mt-0.5">{lead.phone}</span></td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{lead.destination}</td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{lead.travelType}</td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{lead.travelers}</td>
                  <td className="px-4 py-4 relative">
                    <button onClick={() => setOpenMenuId(openMenuId === lead.id ? null : lead.id)} className="text-gray-400 hover:text-[#04706a] p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent"><MoreVertical size={18} /></button>
                    {openMenuId === lead.id && (
                      <ContextMenu leadId={lead.id} onView={() => { setSelectedLead(lead); setView("view"); }} onEdit={() => { setSelectedLead(lead); setView("edit"); }} onConvert={() => { /* TODO */ }} onDelete={() => handleDelete(lead.id)} onClose={() => setOpenMenuId(null)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
