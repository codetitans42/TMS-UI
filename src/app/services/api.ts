// ─────────────────────────────────────────────────────────────────────────────
//  GuestHives TMS — API Service Layer
//  All components should import from here to talk to the backend.
//  Bridging: handles SQL snake_case <-> UI camelCase normalization.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:3001/api";

// ── Normalization Helpers ─────────────────────────────────────────────────────
const toCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = toCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

const toSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toSnake);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      acc[snakeKey] = toSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `API error ${res.status}`);
  }
  return toCamel(json.data) as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelType: string;
  travelDate: string;
  duration?: string;
  travelers: number;
  budget: string;
  leadSource: string;
  notes?: string;
  status: "New" | "In Progress" | "Converted" | "Dropped";
  assignedTo?: number;
  assignedName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  slNo: string;
  guestName: string;
  phone: string;
  email: string;
  location: string;
  destination: string;
  members: number;
  nationality: "Indian" | "Foreigner";
  idTypes: string[];
  country: string;
  startDate: string;
  endDate: string;
  budget: string;
  paymentMode: string;
  status: string;
  leadId?: number;
  packageId?: number;
  packageTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: number;
  code: string;
  title: string;
  destination: string;
  duration: string;
  type: "Domestic" | "International";
  description?: string;
  price?: number;
  inclusions?: string;
  exclusions?: string;
  coverImage?: string;
  status: "Active" | "Draft" | "Deleted";
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryEvent {
  id: number;
  dayId: number;
  eventType: string;
  subtype: string;
  name: string;
  description?: string;
  location?: string;
  eventTime?: string;
  price?: string;
  bookedThrough?: string;
  confirmation?: string;
  carrier?: string;
  amenities: string[];
  imageUrl?: string;
  sortOrder: number;
}

export interface ItineraryDay {
  id: number;
  itineraryId: number;
  dayNumber: number;
  label: string;
  sublabel: string;
  date?: string;
  events: ItineraryEvent[];
}

export interface Itinerary {
  id: number;
  title: string;
  destination: string;
  duration: string;
  dateRange: string;
  idealFor: string;
  category: string;
  startDate?: string;
  endDate?: string;
  status: "Draft" | "Published" | "Archived";
  bookingId?: number;
  leadId?: number;
  createdBy?: number;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

// ── Service Functions ────────────────────────────────────────────────────────

export const leadsApi = {
  list: (params?: { status?: string; search?: string }) =>
    apiFetch<Lead[]>(`/leads?${new URLSearchParams(params as any)}`),
  get: (id: number) => apiFetch<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) =>
    apiFetch<Lead>("/leads", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Lead>) =>
    apiFetch<Lead>(`/leads/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) =>
    apiFetch<void>(`/leads/${id}`, { method: "DELETE" }),
};

export const bookingsApi = {
  list: (params?: { status?: string; search?: string }) =>
    apiFetch<Booking[]>(`/bookings?${new URLSearchParams(params as any)}`),
  get: (id: number) => apiFetch<Booking>(`/bookings/${id}`),
  create: (data: Partial<Booking>) =>
    apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Booking>) =>
    apiFetch<Booking>(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) =>
    apiFetch<void>(`/bookings/${id}`, { method: "DELETE" }),
};

export const packagesApi = {
  list: (params?: { status?: string; search?: string; type?: string }) =>
    apiFetch<Package[]>(`/packages?${new URLSearchParams(params as any)}`),
  get: (id: number) => apiFetch<Package>(`/packages/${id}`),
  create: (data: Partial<Package>) =>
    apiFetch<Package>("/packages", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Package>) =>
    apiFetch<Package>(`/packages/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) =>
    apiFetch<void>(`/packages/${id}`, { method: "DELETE" }),
};

export const itinerariesApi = {
  list: (params?: { status?: string; category?: string; search?: string }) =>
    apiFetch<Itinerary[]>(`/itineraries?${new URLSearchParams(params as any)}`),
  get: (id: number) => apiFetch<Itinerary>(`/itineraries/${id}`),
  create: (data: Partial<Itinerary> & { days?: Partial<ItineraryDay>[] }) =>
    apiFetch<Itinerary>("/itineraries", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Itinerary>) =>
    apiFetch<Itinerary>(`/itineraries/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) =>
    apiFetch<void>(`/itineraries/${id}`, { method: "DELETE" }),
};
