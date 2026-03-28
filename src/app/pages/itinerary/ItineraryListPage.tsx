import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";

import {
  Itinerary,
  ItineraryDay,
  ItineraryEvent,
  ItineraryUpsertInput,
  itinerariesApi,
} from "../../services/api";

type PageView = "listing" | "editor";

interface EditableItinerary extends Omit<Itinerary, "id" | "createdAt" | "updatedAt"> {
  id?: number;
}

const EMPTY_ITINERARY: EditableItinerary = {
  title: "",
  destination: "",
  duration: "",
  dateRange: "",
  idealFor: "",
  category: "Domestic",
  status: "Draft",
  startDate: "",
  endDate: "",
  bookingId: undefined,
  leadId: undefined,
  createdBy: undefined,
  days: [
    {
      id: -1,
      itineraryId: 0,
      dayNumber: 1,
      label: "Day 1",
      sublabel: "",
      date: "",
      events: [],
    },
  ],
};

function createEmptyEvent(dayId: number, sortOrder: number): ItineraryEvent {
  return {
    id: -Date.now() - sortOrder,
    dayId,
    eventType: "Activity",
    subtype: "",
    name: "",
    description: "",
    location: "",
    eventTime: "",
    price: "",
    bookedThrough: "",
    confirmation: "",
    carrier: "",
    amenities: [],
    imageUrl: "",
    sortOrder,
  };
}

function createEmptyDay(dayNumber: number): ItineraryDay {
  return {
    id: -Date.now() - dayNumber,
    itineraryId: 0,
    dayNumber,
    label: `Day ${dayNumber}`,
    sublabel: "",
    date: "",
    events: [],
  };
}

function toEditable(itinerary: Itinerary): EditableItinerary {
  return {
    id: itinerary.id,
    title: itinerary.title,
    destination: itinerary.destination,
    duration: itinerary.duration,
    dateRange: itinerary.dateRange,
    idealFor: itinerary.idealFor,
    category: itinerary.category,
    status: itinerary.status,
    startDate: itinerary.startDate || "",
    endDate: itinerary.endDate || "",
    bookingId: itinerary.bookingId,
    leadId: itinerary.leadId,
    createdBy: itinerary.createdBy,
    days: itinerary.days.map((day) => ({
      ...day,
      date: day.date || "",
      events: day.events.map((event) => ({
        ...event,
        description: event.description || "",
        location: event.location || "",
        eventTime: event.eventTime || "",
        price: event.price || "",
        bookedThrough: event.bookedThrough || "",
        confirmation: event.confirmation || "",
        carrier: event.carrier || "",
        imageUrl: event.imageUrl || "",
      })),
    })),
  };
}

function toPayload(itinerary: EditableItinerary): ItineraryUpsertInput {
  return {
    title: itinerary.title.trim(),
    destination: itinerary.destination.trim(),
    duration: itinerary.duration.trim(),
    dateRange: itinerary.dateRange.trim(),
    idealFor: itinerary.idealFor.trim(),
    category: itinerary.category.trim(),
    status: itinerary.status,
    startDate: itinerary.startDate || undefined,
    endDate: itinerary.endDate || undefined,
    bookingId: itinerary.bookingId,
    leadId: itinerary.leadId,
    createdBy: itinerary.createdBy,
    days: itinerary.days.map((day, dayIndex) => ({
      dayNumber: dayIndex + 1,
      label: day.label.trim(),
      sublabel: day.sublabel.trim(),
      date: day.date || undefined,
      events: day.events
        .filter((event) => event.name.trim())
        .map((event, eventIndex) => ({
          eventType: event.eventType.trim() || "Activity",
          subtype: event.subtype.trim() || undefined,
          name: event.name.trim(),
          description: event.description?.trim() || undefined,
          location: event.location?.trim() || undefined,
          eventTime: event.eventTime?.trim() || undefined,
          price: event.price?.trim() || undefined,
          bookedThrough: event.bookedThrough?.trim() || undefined,
          confirmation: event.confirmation?.trim() || undefined,
          carrier: event.carrier?.trim() || undefined,
          amenities: event.amenities.filter(Boolean),
          imageUrl: event.imageUrl?.trim() || undefined,
          sortOrder: eventIndex,
        })),
    })),
  };
}

function ItineraryEditor({
  itinerary,
  saving,
  error,
  onBack,
  onSave,
}: {
  itinerary: EditableItinerary;
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onSave: (value: EditableItinerary) => Promise<void> | void;
}) {
  const [draft, setDraft] = useState<EditableItinerary>(itinerary);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(itinerary);
  }, [itinerary]);

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white";

  const updateDay = (dayIndex: number, field: keyof ItineraryDay, value: string) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  const updateEvent = (
    dayIndex: number,
    eventIndex: number,
    field: keyof ItineraryEvent,
    value: string
  ) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              events: day.events.map((event, currentEventIndex) =>
                currentEventIndex === eventIndex ? { ...event, [field]: value } : event
              ),
            }
          : day
      ),
    }));
  };

  const addDay = () => {
    setDraft((current) => ({
      ...current,
      days: [...current.days, createEmptyDay(current.days.length + 1)],
    }));
  };

  const removeDay = (dayIndex: number) => {
    setDraft((current) => ({
      ...current,
      days:
        current.days.length === 1
          ? current.days
          : current.days
              .filter((_, index) => index !== dayIndex)
              .map((day, index) => ({ ...day, dayNumber: index + 1 })),
    }));
  };

  const addEvent = (dayIndex: number) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              events: [...day.events, createEmptyEvent(day.id, day.events.length)],
            }
          : day
      ),
    }));
  };

  const removeEvent = (dayIndex: number, eventIndex: number) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? { ...day, events: day.events.filter((_, currentIndex) => currentIndex !== eventIndex) }
          : day
      ),
    }));
  };

  const handleSave = async () => {
    if (
      !draft.title.trim() ||
      !draft.destination.trim() ||
      !draft.duration.trim() ||
      !draft.dateRange.trim() ||
      !draft.idealFor.trim() ||
      !draft.category.trim()
    ) {
      setLocalError("Title, destination, duration, date range, ideal for, and category are required.");
      return;
    }

    if (draft.days.some((day) => !day.label.trim() || !day.sublabel.trim())) {
      setLocalError("Each day needs both a label and a sublabel.");
      return;
    }

    setLocalError(null);
    await onSave(draft);
  };

  return (
    <main className="p-6 max-w-[1100px]">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#374151] mb-5 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0"
      >
        <ArrowLeft size={16} />
        <span>Back to Itineraries</span>
      </button>

      {(localError || error) && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {localError || error}
        </div>
      )}

      <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#374151] mb-1">Title</label>
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Destination</label>
            <input value={draft.destination} onChange={(event) => setDraft({ ...draft, destination: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Duration</label>
            <input value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} className={inputClass} placeholder="5 Days / 4 Nights" />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Date Range</label>
            <input value={draft.dateRange} onChange={(event) => setDraft({ ...draft, dateRange: event.target.value })} className={inputClass} placeholder="10 Apr - 14 Apr" />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Ideal For</label>
            <input value={draft.idealFor} onChange={(event) => setDraft({ ...draft, idealFor: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Category</label>
            <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Status</label>
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as EditableItinerary["status"] })} className={inputClass}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">Start Date</label>
            <input type="date" value={draft.startDate ? draft.startDate.split("T")[0] : ""} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#374151] mb-1">End Date</label>
            <input type="date" value={draft.endDate ? draft.endDate.split("T")[0] : ""} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Days</h2>
          <button
            onClick={addDay}
            className="flex items-center gap-2 bg-[#04706a] text-white px-4 py-2 rounded-lg text-sm border-0 cursor-pointer hover:bg-[#035f55]"
          >
            <Plus size={14} />
            <span>Add Day</span>
          </button>
        </div>

        <div className="space-y-4">
          {draft.days.map((day, dayIndex) => (
            <div key={day.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Day {dayIndex + 1}</h3>
                <button
                  onClick={() => removeDay(dayIndex)}
                  className="text-sm text-red-600 bg-transparent border-0 cursor-pointer disabled:text-gray-300"
                  disabled={draft.days.length === 1}
                >
                  Remove Day
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <input
                  value={day.label}
                  onChange={(event) => updateDay(dayIndex, "label", event.target.value)}
                  className={inputClass}
                  placeholder="Day label"
                />
                <input
                  value={day.sublabel}
                  onChange={(event) => updateDay(dayIndex, "sublabel", event.target.value)}
                  className={inputClass}
                  placeholder="Short summary"
                />
                <input
                  type="date"
                  value={day.date ? day.date.split("T")[0] : ""}
                  onChange={(event) => updateDay(dayIndex, "date", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                {day.events.map((event, eventIndex) => (
                  <div key={event.id} className="rounded-lg border border-gray-100 bg-[#fafafa] p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={event.eventType}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "eventType", evt.target.value)}
                        className={inputClass}
                      >
                        <option value="Activity">Activity</option>
                        <option value="Flight">Flight</option>
                        <option value="Lodging">Lodging</option>
                        <option value="Transport">Transport</option>
                      </select>
                      <input
                        value={event.name}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "name", evt.target.value)}
                        className={inputClass}
                        placeholder="Event name"
                      />
                      <input
                        value={event.subtype}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "subtype", evt.target.value)}
                        className={inputClass}
                        placeholder="Subtype"
                      />
                      <input
                        value={event.location}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "location", evt.target.value)}
                        className={inputClass}
                        placeholder="Location"
                      />
                      <input
                        value={event.eventTime}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "eventTime", evt.target.value)}
                        className={inputClass}
                        placeholder="Time"
                      />
                      <input
                        value={event.price}
                        onChange={(evt) => updateEvent(dayIndex, eventIndex, "price", evt.target.value)}
                        className={inputClass}
                        placeholder="Price"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => removeEvent(dayIndex, eventIndex)}
                        className="text-sm text-red-600 bg-transparent border-0 cursor-pointer"
                      >
                        Remove Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addEvent(dayIndex)}
                className="mt-4 text-sm text-[#04706a] bg-transparent border-0 cursor-pointer"
              >
                + Add Event
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-b from-[#04706a] to-[#b8cbca] border-0 cursor-pointer disabled:opacity-70"
          >
            {saving ? "Saving..." : draft.id ? "Save Changes" : "Create Itinerary"}
          </button>
        </div>
      </div>
    </main>
  );
}

export function ItineraryListPage() {
  const [view, setView] = useState<PageView>("listing");
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<EditableItinerary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const data = await itinerariesApi.list();
      setItineraries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load itineraries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItineraries();
  }, []);

  const filteredItineraries = itineraries.filter((itinerary) => {
    const matchesSearch =
      !searchQuery ||
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || itinerary.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(["All", ...itineraries.map((itinerary) => itinerary.category)])
  );

  const handleSave = async (draft: EditableItinerary) => {
    try {
      setSaving(true);
      setError(null);

      const payload = toPayload(draft);

      if (draft.id) {
        await itinerariesApi.update(draft.id, payload);
      } else {
        await itinerariesApi.create(payload);
      }

      await loadItineraries();
      setSelectedItinerary(null);
      setView("listing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this itinerary?")) {
      return;
    }

    try {
      setError(null);
      await itinerariesApi.delete(id);
      await loadItineraries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete itinerary.");
    }
  };

  if (view === "editor" && selectedItinerary) {
    return (
      <ItineraryEditor
        itinerary={selectedItinerary}
        saving={saving}
        error={error}
        onBack={() => {
          setView("listing");
          setSelectedItinerary(null);
          setError(null);
        }}
        onSave={handleSave}
      />
    );
  }

  return (
    <main className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search itineraries"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04706a]/30 focus:border-[#04706a] bg-white text-[#374151]"
          />
        </div>
        <button
          onClick={() => {
            setSelectedItinerary({
              ...EMPTY_ITINERARY,
              days: [createEmptyDay(1)],
            });
            setView("editor");
            setError(null);
          }}
          className="flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer border-0 whitespace-nowrap"
        >
          <span>Create Itinerary</span>
          <Plus size={16} />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer border-2 transition-all ${
              activeCategory === category
                ? "bg-[#04706a] border-[#04706a] text-white"
                : "bg-white border-[#04706a] text-[#04706a] hover:bg-[#04706a]/5"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-10 text-center text-gray-400">
          Loading itineraries...
        </div>
      ) : filteredItineraries.length === 0 ? (
        <div className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-10 text-center text-gray-500">
          No itineraries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="bg-white border border-[rgba(6,127,121,0.35)] rounded-xl shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]">{itinerary.title}</h2>
                  <p className="text-sm text-gray-500">{itinerary.destination}</p>
                </div>
                <span className="rounded-full bg-[#f0fafa] px-3 py-1 text-xs font-medium text-[#04706a]">
                  {itinerary.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-[#374151]">
                <p><span className="text-gray-400">Duration:</span> {itinerary.duration}</p>
                <p><span className="text-gray-400">Date Range:</span> {itinerary.dateRange}</p>
                <p><span className="text-gray-400">Ideal For:</span> {itinerary.idealFor}</p>
                <p><span className="text-gray-400">Category:</span> {itinerary.category}</p>
                <p><span className="text-gray-400">Days:</span> {itinerary.days.length}</p>
              </div>
              <div className="flex items-center justify-between mt-5">
                <button
                  onClick={() => {
                    setSelectedItinerary(toEditable(itinerary));
                    setView("editor");
                    setError(null);
                  }}
                  className="text-sm text-[#04706a] bg-transparent border-0 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(itinerary.id)}
                  className="flex items-center gap-1 text-sm text-red-600 bg-transparent border-0 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
