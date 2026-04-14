import React, { useState, useRef, useEffect } from "react";
import {
  Search, MoreVertical, Edit2, Eye, Trash2,
  Users, Calendar, ChevronDown, ArrowLeft, Plus, X, Check
} from "lucide-react";
import { bookingsApi, Booking } from "../../services/api";

type PageView = "list" | "create" | "edit" | "view";
type FormStep = "user-info" | "itinerary";

const ID_TYPE_OPTIONS = ["Aadhar Card", "Pan Card", "Passport"];
const PAYMENT_MODES = ["Online", "Cash", "Card", "UPI", "Bank Transfer"];
const COUNTRIES = ["India", "USA", "UK", "UAE", "Germany", "France", "Australia", "Canada"];

const ITINERARY_PLANS = [
  { id: 1, label: "Itinerary Plan - 1", imgKeyword: "thailand-temple" },
  { id: 2, label: "Itinerary Plan - 2", imgKeyword: "dubai-burj" },
  { id: 3, label: "Itinerary Plan - 3", imgKeyword: "taj-mahal" },
];

// ─── Context Menu ─────────────────────────────────────────────────────────────
interface CtxMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}
function ContextMenu({ onView, onEdit, onDelete, onClose }: CtxMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref}
      className="absolute right-10 top-2 z-50 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[160px]"
      role="menu">
      <button role="menuitem" onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm bg-[#04706a] text-white hover:bg-[#035f55] cursor-pointer border-0 text-left">
        <Edit2 size={14} /><span>Edit</span>
      </button>
      <button role="menuitem" onClick={() => { onView(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 cursor-pointer border-0 bg-white text-left">
        <Eye size={14} /><span>View Detail</span>
      </button>
      <button role="menuitem" onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-0 bg-white text-left">
        <Trash2 size={14} /><span>Delete</span>
      </button>
    </div>
  );
}

// ─── ID Type Tag selector ──────────────────────────────────────────────────────
function IdTypeSelector({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };
  return (
    <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 flex flex-wrap gap-2 min-h-[44px] bg-white">
      {selected.map(tag => (
        <span key={tag}
          className="flex items-center gap-1 bg-[#04706a] text-white text-xs px-3 py-1 rounded-full font-medium">
          {tag}
          <button onClick={() => toggle(tag)} className="ml-1 hover:opacity-80 bg-transparent border-0 cursor-pointer text-white p-0">
            <X size={10} />
          </button>
        </span>
      ))}
      <div className="flex gap-1 ml-auto">
        {ID_TYPE_OPTIONS.filter(t => !selected.includes(t)).map(tag => (
          <button key={tag} onClick={() => toggle(tag)}
            className="text-xs px-2 py-1 border border-dashed border-gray-300 rounded-full text-gray-400 hover:border-[#04706a] hover:text-[#04706a] bg-transparent cursor-pointer">
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Booking Form ──────────────────────────────────────────────────────────────
interface BookingFormProps {
  initial?: Partial<Booking>;
  onCancel: () => void;
  onSubmit: (data: Partial<Booking>) => void;
  mode: "create" | "edit";
}
function BookingForm({ initial = {}, onCancel, onSubmit, mode }: BookingFormProps) {
  const [step, setStep] = useState<FormStep>("user-info");
  const [nationality, setNationality] = useState<"Indian" | "Foreigner">(initial.nationality ?? "Indian");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [idTypes, setIdTypes] = useState<string[]>(initial.idTypes ?? []);
  const [name, setName] = useState(initial.guestName ?? "");
  const [country, setCountry] = useState(initial.country ?? "India");
  const [destination, setDestination] = useState(initial.destination ?? "");
  const [members, setMembers] = useState(String(initial.members ?? 1));
  const [startDate, setStartDate] = useState(initial.startDate ? initial.startDate.split('T')[0] : "");
  const [endDate, setEndDate] = useState(initial.endDate ? initial.endDate.split('T')[0] : "");
  const [budget, setBudget] = useState(initial.budget ?? "");
  const [paymentMode, setPaymentMode] = useState(initial.paymentMode ?? "");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white placeholder-gray-300";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  const handleSuggestPlans = () => setStep("itinerary");
  const handleFinalSubmit = () => {
    onSubmit({
      nationality, phone, email, idTypes, guestName: name, country,
      destination, members: Number(members), startDate, endDate, budget, paymentMode,
      status: "Active"
    });
  };

  return (
    <div className="max-w-[900px]">
      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            {step === "user-info" ? "User Information" : "Select Itinerary Plan"}
          </h2>
        </div>

        <div className="px-8 py-6">
          {step === "user-info" && (
            <>
              <div className="mb-5">
                <span className="text-sm text-[#374151] mr-4 font-medium">Nationality</span>
                <label className="inline-flex items-center gap-1.5 mr-5 cursor-pointer text-sm text-[#374151]">
                  <input type="radio" checked={nationality === "Indian"} onChange={() => setNationality("Indian")} className="accent-[#04706a] w-4 h-4" /> Indian
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-[#374151]">
                  <input type="radio" checked={nationality === "Foreigner"} onChange={() => setNationality("Foreigner")} className="accent-[#04706a] w-4 h-4" /> Foreigner
                </label>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className={inputClass} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email ID" className={inputClass} />
              </div>

              <div className="mb-5">
                <IdTypeSelector selected={idTypes} onChange={setIdTypes} />
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Guest Name" className={inputClass} />
                <div className="relative">
                  <select value={country} onChange={e => setCountry(e.target.value)} className={selectClass}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination" className={inputClass} />
                <input type="number" min={1} value={members} onChange={e => setMembers(e.target.value)} placeholder="Members" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="relative">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={`${inputClass} pr-10`} />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={`${inputClass} pr-10`} />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-8">
                <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget" className={inputClass} />
                <div className="relative">
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={selectClass}>
                    <option value="">Payment Mode</option>
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button onClick={handleSuggestPlans} className="w-full py-3.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm font-semibold hover:opacity-90 cursor-pointer border-0">
                Suggest Plans
              </button>
            </>
          )}

          {step === "itinerary" && (
            <>
              <button onClick={() => setStep("user-info")} className="flex items-center gap-1.5 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0">
                <ArrowLeft size={15} /><span>Back to User Information</span>
              </button>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {ITINERARY_PLANS.map(plan => (
                  <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedPlan === plan.id ? "border-[#04706a] ring-2 ring-[#04706a]/30" : "border-transparent"}`}>
                    <div className="w-full h-32 bg-gradient-to-br from-[#04706a]/70 to-[#b8cbca] flex items-center justify-center text-2xl">🏛️</div>
                    <div className="bg-[#04706a]/85 text-white text-xs font-medium text-center py-2 px-2">{plan.label}</div>
                    {selectedPlan === plan.id && <div className="absolute top-2 right-2 w-6 h-6 bg-[#04706a] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                  </div>
                ))}
              </div>
              <button onClick={handleFinalSubmit} className="w-full py-3.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm font-semibold hover:opacity-90 cursor-pointer border-0">
                {mode === "create" ? "Create Booking" : "Save Changes"}
              </button>
            </>
          )}
        </div>

        {step === "user-info" && (
          <div className="px-8 pb-6">
            <button onClick={onCancel} className="w-full py-2.5 border border-gray-200 text-[#374151] rounded-lg text-sm hover:bg-gray-50 cursor-pointer bg-white">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Booking Detail View ───────────────────────────────────────────────────────
function BookingDetailView({ booking, onBack, onEdit }: { booking: Booking; onBack: () => void; onEdit: () => void }) {
  return (
    <div className="max-w-[900px]">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0">
        <ArrowLeft size={16} /><span>Back to Bookings</span>
      </button>
      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#1a1a1a]">{booking.guestName}</h2>
            <p className="text-xs text-gray-400">Booking ID: #{booking.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">{booking.status}</span>
            <button onClick={onEdit} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm cursor-pointer border-0"><Edit2 size={14} /><span>Edit</span></button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {[
            { label: "Phone", value: booking.phone },
            { label: "Email", value: booking.email },
            { label: "Location", value: booking.location },
            { label: "Destination", value: booking.destination },
            { label: "Members", value: String(booking.members) },
            { label: "Nationality", value: booking.nationality },
            { label: "Country", value: booking.country },
            { label: "Start Date", value: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "" },
            { label: "End Date", value: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "" },
            { label: "Budget", value: booking.budget },
            { label: "Payment Mode", value: booking.paymentMode },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-medium text-[#1a1a1a]">{value || "—"}</p>
            </div>
          ))}

          {booking.idTypes.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-2">ID Types</p>
              <div className="flex gap-2 flex-wrap">{booking.idTypes.map(tag => <span key={tag} className="bg-[#04706a] text-white text-xs px-3 py-1 rounded-full font-medium">{tag}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Bookings Page ───────────────────────────────────────────────────────
export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<PageView>("list");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.list();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshBookings(); }, []);

  const handleCreate = async (data: Partial<Booking>) => {
    try {
      await bookingsApi.create({ ...data, slNo: String(Math.floor(Math.random() * 9000) + 1000) });
      setView("list");
      refreshBookings();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleEdit = async (data: Partial<Booking>) => {
    if (!selectedBooking) return;
    try {
      await bookingsApi.update(selectedBooking.id, data);
      setView("list");
      setSelectedBooking(null);
      refreshBookings();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await bookingsApi.delete(id);
      refreshBookings();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const filtered = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q || b.guestName.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q) || b.phone.includes(q);
  });

  if (view === "create") {
    return (
      <main className="p-6">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0"><ArrowLeft size={16} /><span>Back to Bookings</span></button>
        <BookingForm mode="create" onCancel={() => setView("list")} onSubmit={handleCreate} />
      </main>
    );
  }
  if (view === "edit" && selectedBooking) {
    return (
      <main className="p-6">
        <button onClick={() => { setView("list"); setSelectedBooking(null); }} className="flex items-center gap-2 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0"><ArrowLeft size={16} /><span>Back to Bookings</span></button>
        <BookingForm mode="edit" initial={selectedBooking} onCancel={() => { setView("list"); setSelectedBooking(null); }} onSubmit={handleEdit} />
      </main>
    );
  }
  if (view === "view" && selectedBooking) {
    return (
      <main className="p-6">
        <BookingDetailView booking={selectedBooking} onBack={() => { setView("list"); setSelectedBooking(null); }} onEdit={() => setView("edit")} />
      </main>
    );
  }

  return (
    <main className="bookings-page p-6" data-page="bookings">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by Name, Email or Phone" className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white" />
        </div>
        <button onClick={() => setView("create")} className="flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer border-0 whitespace-nowrap"><Plus size={16} /><span>New Booking</span></button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex justify-between"><span>{error}</span><button onClick={refreshBookings} className="underline font-semibold bg-transparent border-0 cursor-pointer">Retry</button></div>}

      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse">Loading bookings...</div>
        ) : (
          <table className="w-full border-collapse" data-component="bookings-table">
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #04706a 0%, #b8cbca 100%)" }} className="text-white text-sm">
                <th className="text-left px-5 py-4 font-semibold w-24">Sl.No</th>
                <th className="text-left px-5 py-4 font-semibold">Guest Name</th>
                <th className="text-left px-5 py-4 font-semibold">Email</th>
                <th className="text-left px-5 py-4 font-semibold">Location</th>
                <th className="text-left px-5 py-4 font-semibold">Destination</th>
                <th className="text-left px-5 py-4 font-semibold">Members</th>
                <th className="px-5 py-4 w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={7} className="text-center text-gray-400 text-sm py-16">No bookings found in database.</td></tr>
              )}
              {filtered.map((booking, idx) => (
                <tr key={booking.id} className={`border-b border-gray-100 hover:bg-[#f0fafa] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                  <td className="px-5 py-4 text-sm text-[#374151]">{booking.slNo}</td>
                  <td className="px-5 py-4"><span className="block text-sm font-semibold text-[#1a1a1a] leading-snug">{booking.guestName}</span><span className="block text-xs text-gray-400 mt-0.5">{booking.phone}</span></td>
                  <td className="px-5 py-4 text-sm text-[#374151]">{booking.email}</td>
                  <td className="px-5 py-4 text-sm text-[#374151]">{booking.location}</td>
                  <td className="px-5 py-4 text-sm text-[#374151]">{booking.destination}</td>
                  <td className="px-5 py-4"><span className="flex items-center gap-1.5 text-sm text-[#374151]"><Users size={15} className="text-[#04706a]" />{booking.members}</span></td>
                  <td className="px-5 py-4 relative">
                    <button onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)} className="text-gray-400 hover:text-[#04706a] p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent"><MoreVertical size={18} /></button>
                    {openMenuId === booking.id && (
                      <ContextMenu onView={() => { setSelectedBooking(booking); setView("view"); }} onEdit={() => { setSelectedBooking(booking); setView("edit"); }} onDelete={() => handleDelete(booking.id)} onClose={() => setOpenMenuId(null)} />
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
