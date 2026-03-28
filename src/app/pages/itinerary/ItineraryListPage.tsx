import React, { useState, useRef, useEffect } from "react";
import {
  Search, Plus, MapPin, Calendar, ChevronDown, X, Sparkles,
  Bed, Plane, Car, Activity, BookOpen, Building2, Download,
  Play, Globe, Save, Edit2, Trash2, Check, Filter, SlidersHorizontal
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type PageView = "listing" | "builder";
type LibraryTab = "Lodging" | "Flight" | "Transport" | "Activity" | "City Guide" | "Agencies";
type EventType = "Lodging" | "Transport" | "Activity" | "Flight";

interface DayEvent {
  id: string;
  type: EventType;
  subtype: string;
  name: string;
  description: string;
  location: string;
  time: string;
  price: string;
  bookedThrough: string;
  confirmation: string;
  carrier: string;
  image?: string;
  amenities: string[];
}

interface ItineraryDay {
  id: string;
  label: string;   // "Aug,29"
  sublabel: string; // "Friday"
}

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  dateRange: string;
  idealFor: string;
  category: string;
  days: ItineraryDay[];
  events: Record<string, DayEvent[]>; // dayId -> events
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Domestic", "International", "Honeymoon", "Solo", "Business", "Party"];
const LIBRARY_TABS: LibraryTab[] = ["Lodging", "Flight", "Transport", "Activity", "City Guide", "Agencies"];

const LIBRARY_ICON: Record<LibraryTab, React.ReactNode> = {
  Lodging: <Bed size={13} />,
  Flight: <Plane size={13} />,
  Transport: <Car size={13} />,
  Activity: <Activity size={13} />,
  "City Guide": <BookOpen size={13} />,
  Agencies: <Building2 size={13} />,
};

const EVENT_TYPE_ICON: Record<EventType, React.ReactNode> = {
  Lodging: <Bed size={14} className="text-[#04706a]" />,
  Transport: <Car size={14} className="text-[#04706a]" />,
  Activity: <Activity size={14} className="text-[#04706a]" />,
  Flight: <Plane size={14} className="text-[#04706a]" />,
};

const TOP_DESTINATIONS = [
  { name: "Kashmir", emoji: "🏔️", color: "from-slate-400 to-slate-600" },
  { name: "Dubai", emoji: "🌆", color: "from-amber-400 to-orange-600" },
  { name: "Thailand", emoji: "🏯", color: "from-emerald-400 to-teal-600" },
  { name: "Iceland", emoji: "🌋", color: "from-blue-400 to-indigo-600" },
  { name: "Maldives", emoji: "🏝️", color: "from-cyan-300 to-blue-500" },
  { name: "Paris", emoji: "🗼", color: "from-rose-300 to-pink-600" },
];

const MOCK_LIBRARY_ITEMS: Record<LibraryTab, { name: string; location: string; tags: string[] }[]> = {
  Lodging: [
    { name: "Kashmir Holiday Resort", location: "Srinagar, Jammu and Kashmir", tags: ["Pool", "Parking", "Breakfast", "Wi-Fi"] },
    { name: "Hotel The Elegance", location: "Jammu and Kashmir", tags: ["Parking free", "Breakfast free", "Wi-Fi"] },
    { name: "Dal View Cottage", location: "Srinagar", tags: ["Lake view", "Breakfast"] },
  ],
  Flight: [
    { name: "AI-203 Air India", location: "Delhi → Srinagar", tags: ["Economy", "9:00 AM"] },
    { name: "6E-501 IndiGo", location: "Mumbai → Delhi", tags: ["Economy", "7:30 AM"] },
  ],
  Transport: [
    { name: "VANDE BHARAT | 22439", location: "Delhi to Srinagar", tags: ["Sat, 30 Aug • 21:00 - 22:55"] },
    { name: "Private Transfer", location: "Airport", tags: ["Car", "30 Aug • 21:00"] },
  ],
  Activity: [
    { name: "Gulmarg Cable Car", location: "Gulmarg", tags: ["Sightseeing", "Adventure"] },
    { name: "Shikara Ride", location: "Dal Lake, Srinagar", tags: ["2 hrs", "Scenic"] },
  ],
  "City Guide": [
    { name: "Srinagar Walking Tour", location: "Srinagar Old City", tags: ["3 hrs", "History"] },
  ],
  Agencies: [
    { name: "GT Holidays", location: "New Delhi", tags: ["Tour operator"] },
  ],
};

// ─── Initial mock itinerary ────────────────────────────────────────────────────
const DEFAULT_DAYS: ItineraryDay[] = [
  { id: "d1", label: "Aug,29", sublabel: "Friday" },
  { id: "d2", label: "Aug,30", sublabel: "Friday" },
  { id: "d3", label: "Aug,31", sublabel: "Friday" },
  { id: "d4", label: "Sep,01", sublabel: "Friday" },
  { id: "d5", label: "Sep,02", sublabel: "Friday" },
  { id: "d6", label: "Sep,03", sublabel: "Friday" },
];

const DEFAULT_EVENTS: Record<string, DayEvent[]> = {
  d2: [
    {
      id: "ev1", type: "Transport", subtype: "Pickup", name: "Private Transfer",
      description: "", location: "Airport", time: "Sat, 30 Aug • 21:00",
      price: "2000", bookedThrough: "GT holidays", confirmation: "1121212", carrier: "GT holidays",
      amenities: [],
    },
    {
      id: "ev2", type: "Lodging", subtype: "", name: "Kashmir Holiday Resort",
      description: "By Dal Lake, Foreshore Rd, Habak, Nasim Bagh, Srinagar",
      location: "Srinagar", time: "Check-in: Sat, 30 Aug — Check-out: Sat, 30 Aug",
      price: "2000", bookedThrough: "GT holidays", confirmation: "1121212", carrier: "GT holidays",
      amenities: ["Pool", "Parking free", "Breakfast free", "Wi-Fi"],
    },
  ],
};

// ─── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#04706a]/20 to-[#b8cbca]/30 flex items-center justify-center mb-5 text-5xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Great Job</h2>
        <p className="text-sm text-gray-500 text-center mb-7">You've successfully created an itinerary</p>
        <button onClick={onDone}
          className="w-full py-3 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-0">
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Add Event Panel (inline form) ────────────────────────────────────────────
interface AddEventPanelProps {
  type: EventType;
  onAdd: (ev: Omit<DayEvent, "id">) => void;
  onCancel: () => void;
}
function AddEventPanel({ type, onAdd, onCancel }: AddEventPanelProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [carrier, setCarrier] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [bookedThrough, setBookedThrough] = useState("GT holidays");
  const [subtype, setSubtype] = useState(type === "Transport" ? "Pickup" : type === "Activity" ? "Sightseeing" : "");

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white placeholder-gray-300";

  const subtypeOptions: Record<EventType, string[]> = {
    Transport: ["Pickup", "Arrival", "Drop"],
    Activity: ["Sightseeing", "Food & Drink", "Adventure", "Cultural"],
    Lodging: [],
    Flight: ["Departure", "Arrival"],
  };

  return (
    <div className="bg-[#f0fafa] border border-[#04706a]/20 rounded-xl p-5 mb-3 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {EVENT_TYPE_ICON[type]}
        <span className="text-sm font-semibold text-[#04706a]">{type}</span>
        {subtypeOptions[type].length > 0 && (
          <>
            <span className="text-gray-400">•</span>
            <select value={subtype} onChange={e => setSubtype(e.target.value)}
              className="text-sm text-gray-500 border-0 bg-transparent focus:outline-none cursor-pointer">
              {subtypeOptions[type].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </>
        )}
        <button onClick={onCancel} className="ml-auto text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder={type === "Lodging" ? "Hotel / Resort Name" : type === "Flight" ? "Flight Number" : "Name"} className={inputClass} />
        </div>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className={inputClass} />
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="Date & Time" className={inputClass} />
        <input value={bookedThrough} onChange={e => setBookedThrough(e.target.value)} placeholder="Booked Through" className={inputClass} />
        <input value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder="Confirmation" className={inputClass} />
        <input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="Carrier" className={inputClass} />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className={inputClass} />
      </div>
      <button
        onClick={() => {
          if (!name.trim()) return;
          onAdd({ type, subtype, name, description: "", location, time, price, bookedThrough, confirmation, carrier, amenities: [] });
        }}
        className="w-full py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-0">
        Add {type}
      </button>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, onRemove }: { event: DayEvent; onRemove: () => void }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
        {EVENT_TYPE_ICON[event.type]}
        <span className="font-medium">{event.type}</span>
        {event.subtype && <><span className="text-gray-300">•</span><span>{event.subtype}</span></>}
        <button onClick={onRemove} className="ml-auto text-gray-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 text-xs">
          Remove
        </button>
      </div>
      <div className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        {/* Placeholder image */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#04706a]/30 to-[#b8cbca]/50 flex items-center justify-center flex-shrink-0 text-xl">
          {event.type === "Lodging" ? "🏨" : event.type === "Flight" ? "✈️" : event.type === "Transport" ? "🚗" : "🎭"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1a1a1a] leading-tight mb-1">{event.name}</p>
          {event.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
              <MapPin size={11} />{event.location}
            </p>
          )}
          {event.amenities.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1">
              {event.amenities.map(a => (
                <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
          )}
          {event.time && <p className="text-xs text-gray-400">{event.time}</p>}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[
              { label: "Booked Through", value: event.bookedThrough },
              { label: "Confirmation", value: event.confirmation },
              { label: "Carrier", value: event.carrier },
              { label: "Price", value: event.price },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-400">{label}</p>
                <p className="text-xs font-medium text-[#1a1a1a]">{value || `Eg: ${label}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Itinerary Builder ────────────────────────────────────────────────────────
function ItineraryBuilder({ itinerary, onSave, onBack }: {
  itinerary: Itinerary;
  onSave: () => void;
  onBack: () => void;
}) {
  const [days, setDays] = useState<ItineraryDay[]>(itinerary.days);
  const [activeDay, setActiveDay] = useState<string>(itinerary.days[0]?.id ?? "d1");
  const [events, setEvents] = useState<Record<string, DayEvent[]>>(itinerary.events);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>("Lodging");
  const [librarySearch, setLibrarySearch] = useState("");
  const [addingEventType, setAddingEventType] = useState<EventType | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) setShowAddMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addDay = () => {
    const id = `d${Date.now()}`;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const label = `${months[now.getMonth()]},${now.getDate() + days.length}`;
    setDays(prev => [...prev, { id, label, sublabel: "Friday" }]);
    setActiveDay(id);
  };

  const addEvent = (ev: Omit<DayEvent, "id">) => {
    const newEv: DayEvent = { ...ev, id: `ev-${Date.now()}` };
    setEvents(prev => ({ ...prev, [activeDay]: [...(prev[activeDay] ?? []), newEv] }));
    setAddingEventType(null);
  };

  const removeEvent = (evId: string) => {
    setEvents(prev => ({ ...prev, [activeDay]: (prev[activeDay] ?? []).filter(e => e.id !== evId) }));
  };

  const addFromLibrary = (item: { name: string; location: string; tags: string[] }) => {
    addEvent({
      type: libraryTab === "City Guide" || libraryTab === "Agencies" ? "Activity" : libraryTab as EventType,
      subtype: libraryTab === "Lodging" ? "" : libraryTab,
      name: item.name,
      description: "",
      location: item.location,
      time: "",
      price: "",
      bookedThrough: "GT holidays",
      confirmation: "",
      carrier: "",
      amenities: item.tags,
    });
  };

  const currentEvents = events[activeDay] ?? [];
  const filteredLibrary = MOCK_LIBRARY_ITEMS[libraryTab].filter(i =>
    !librarySearch || i.name.toLowerCase().includes(librarySearch.toLowerCase())
  );

  const EVENT_MENU_OPTIONS: { type: EventType; label: string; icon: React.ReactNode }[] = [
    { type: "Lodging", label: "Lodging", icon: <Bed size={15} /> },
    { type: "Flight", label: "Flight", icon: <Plane size={15} /> },
    { type: "Transport", label: "Transport", icon: <Car size={15} /> },
    { type: "Activity", label: "Activity", icon: <Activity size={15} /> },
  ];

  return (
    <>
      {showSuccess && (
        <SuccessModal onDone={() => { setShowSuccess(false); onBack(); }} />
      )}

      <div className="flex flex-col h-full" style={{ height: "calc(100vh - 80px)" }}>
        {/* Sub-topbar for itinerary actions */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#04706a] bg-transparent border-0 cursor-pointer p-0">
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
              <Play size={14} /><span>Preview</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
              <Download size={14} /><span>Download</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white bg-gradient-to-b from-[#04706a] to-[#b8cbca] px-3 py-1.5 rounded-lg hover:opacity-90 cursor-pointer border-0">
              <Globe size={14} /><span>Create Virtual Tour</span>
            </button>
            <button
              onClick={() => setShowSuccess(true)}
              className="flex items-center gap-1.5 text-sm text-white bg-[#04706a] px-4 py-1.5 rounded-lg hover:bg-[#035f55] cursor-pointer border-0 font-medium">
              <Save size={14} /><span>Save</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Centre Panel ─────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {/* Banner */}
            <div className="relative h-52 bg-gradient-to-br from-slate-400 to-slate-700 flex items-end">
              <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=60')] bg-cover bg-center" />
              <div className="relative px-6 pb-4 flex items-end justify-between w-full">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-bold drop-shadow">{itinerary.title}</span>
                  <Edit2 size={16} className="opacity-70" />
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>Ideal For</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-white font-medium">{itinerary.idealFor}</span>
                </div>
              </div>
              <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 border-0 cursor-pointer">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="px-6 py-4">
              {/* Meta */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-base font-semibold text-[#1a1a1a]">{itinerary.duration} - {itinerary.destination}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} />{itinerary.destination}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} />{itinerary.dateRange}</span>
                </div>
              </div>

              {/* Day tabs */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                {days.map(day => (
                  <button key={day.id}
                    onClick={() => setActiveDay(day.id)}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl border text-sm shrink-0 cursor-pointer transition-all min-w-[80px] ${activeDay === day.id ? "bg-[#04706a] border-[#04706a] text-white" : "bg-white border-gray-200 text-[#374151] hover:border-[#04706a]/50"}`}>
                    <span className="font-semibold text-xs">{day.label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{day.sublabel}</span>
                  </button>
                ))}
                <button onClick={addDay}
                  className="flex items-center gap-1.5 px-4 py-3 bg-[#04706a] text-white rounded-xl text-sm shrink-0 cursor-pointer border-0 hover:opacity-90 transition-opacity whitespace-nowrap">
                  <Plus size={14} /><span>New Day</span>
                </button>
              </div>

              {/* Events Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#1a1a1a]">Events</h3>
                <button className="flex items-center gap-1.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border-0">
                  <Sparkles size={13} /><span>Smart Import</span>
                </button>
              </div>

              {/* Events List */}
              {currentEvents.length === 0 && !addingEventType && (
                <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                  No events yet. Add events from the library or the + button below.
                </div>
              )}
              {currentEvents.map(ev => (
                <EventCard key={ev.id} event={ev} onRemove={() => removeEvent(ev.id)} />
              ))}

              {/* Add Event Form */}
              {addingEventType && (
                <AddEventPanel type={addingEventType} onAdd={addEvent} onCancel={() => setAddingEventType(null)} />
              )}

              {/* + FAB to add event */}
              <div className="flex justify-end mt-4 relative" ref={addMenuRef}>
                <button
                  onClick={() => setShowAddMenu(prev => !prev)}
                  className="w-12 h-12 rounded-full bg-[#04706a] text-white flex items-center justify-center shadow-lg hover:bg-[#035f55] cursor-pointer border-0 transition-colors">
                  <Plus size={22} />
                </button>
                {showAddMenu && (
                  <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[180px] z-30">
                    {EVENT_MENU_OPTIONS.map(opt => (
                      <button key={opt.type}
                        onClick={() => { setAddingEventType(opt.type); setShowAddMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f0fafa] hover:text-[#04706a] cursor-pointer border-0 bg-white text-left">
                        {opt.icon}<span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Panel — Event Library ─────────────────────────── */}
          <div className="w-64 bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">Event Library</h4>
              {/* Library Search */}
              <div className="relative mb-3">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search" value={librarySearch} onChange={e => setLibrarySearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 bg-white"
                />
                <Filter size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {/* Library Tabs — 2 rows */}
              <div className="grid grid-cols-3 gap-1.5">
                {LIBRARY_TABS.map(tab => (
                  <button key={tab}
                    onClick={() => setLibraryTab(tab)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer border transition-colors ${libraryTab === tab ? "bg-[#04706a] text-white border-[#04706a]" : "bg-white text-gray-500 border-gray-200 hover:border-[#04706a]/40"}`}>
                    {LIBRARY_ICON[tab]}<span>{tab}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Library Items */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {filteredLibrary.map((item, i) => (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:border-[#04706a]/40 hover:shadow-sm transition-all group"
                  onClick={() => addFromLibrary(item)}>
                  <div className="h-16 bg-gradient-to-br from-[#04706a]/20 to-[#b8cbca]/30 flex items-center justify-center text-2xl">
                    {libraryTab === "Lodging" ? "🏨" : libraryTab === "Flight" ? "✈️" : libraryTab === "Transport" ? "🚂" : libraryTab === "Activity" ? "🎭" : libraryTab === "City Guide" ? "🗺️" : "🏢"}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-[#1a1a1a] leading-tight">{item.name}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin size={9} />{item.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Add indicator on hover */}
                  <div className="hidden group-hover:flex items-center justify-center p-1 bg-[#04706a]/10 text-[#04706a] text-[10px] font-medium">
                    + Add to Day
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Listing Page ─────────────────────────────────────────────────────────────
export function ItineraryListPage() {
  const [view, setView] = useState<PageView>("listing");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(null);

  const defaultItinerary: Itinerary = {
    id: "it-001",
    title: "Kashmir",
    destination: "Kashmir",
    duration: "5 Days , 6 Nights",
    dateRange: "29/08 - 05/09",
    idealFor: "Adults",
    category: "Domestic",
    days: DEFAULT_DAYS,
    events: DEFAULT_EVENTS,
  };

  if (view === "builder" && activeItinerary) {
    return (
      <ItineraryBuilder
        itinerary={activeItinerary}
        onSave={() => setView("listing")}
        onBack={() => setView("listing")}
      />
    );
  }

  return (
    <main className="itinerary-page p-6" data-page="itinerary">
      {/* Search + Create */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by location"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white text-[#374151]"
          />
        </div>
        <button
          onClick={() => { setActiveItinerary(defaultItinerary); setView("builder"); }}
          className="flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-0 whitespace-nowrap">
          <span>Create Itinerary</span><Plus size={16} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer border-2 transition-all ${activeCategory === cat ? "bg-[#04706a] border-[#04706a] text-white" : "bg-white border-[#04706a] text-[#04706a] hover:bg-[#04706a]/5"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Top Destinations */}
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Top Destinations</h2>
        <div className="grid grid-cols-3 gap-4">
          {TOP_DESTINATIONS.map(dest => (
            <div key={dest.name}
              onClick={() => {
                setActiveItinerary({ ...defaultItinerary, title: dest.name, destination: dest.name });
                setView("builder");
              }}
              className={`relative h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br ${dest.color} shadow-sm hover:shadow-lg transition-shadow`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl mb-2">{dest.emoji}</span>
                <span className="text-white font-bold text-base drop-shadow">{dest.name}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
