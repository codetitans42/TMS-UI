const DEFAULT_BASE_URL = "http://localhost:3001/api";

const configuredBaseUrl =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).trim()
    : "";

const BASE_URL = (configuredBaseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");

type QueryValue = string | number | boolean | null | undefined;

function toCamel(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => toCamel(item));
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce(
      (result, [key, nestedValue]) => {
        const camelKey = key.replace(/_([a-z])/g, (_match, letter: string) =>
          letter.toUpperCase()
        );
        result[camelKey] = toCamel(nestedValue);
        return result;
      },
      {} as Record<string, unknown>
    );
  }

  return value;
}

function toSnake(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => toSnake(item));
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce(
      (result, [key, nestedValue]) => {
        if (nestedValue === undefined) {
          return result;
        }

        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        result[snakeKey] = toSnake(nestedValue);
        return result;
      },
      {} as Record<string, unknown>
    );
  }

  return value;
}

function buildQuery(params?: Record<string, QueryValue>): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error(`Unable to reach the API at ${BASE_URL}. Ensure the API server is running.`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object"
        ? String(
            (payload as Record<string, unknown>).error ??
              (payload as Record<string, unknown>).message ??
              `Request failed with status ${response.status}`
          )
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!payload || typeof payload !== "object") {
    return payload as T;
  }

  if ("success" in (payload as Record<string, unknown>)) {
    const envelope = payload as {
      success: boolean;
      data?: unknown;
      error?: string;
    };

    if (!envelope.success) {
      throw new Error(envelope.error || "Request failed.");
    }

    return toCamel(envelope.data) as T;
  }

  return toCamel(payload) as T;
}

export interface DashboardSummary {
  totalLeads: number;
  activePackages: number;
  totalBookings: number;
  draftItineraries: number;
}

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

export interface PackageAddOn {
  service: string;
  price: number;
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
  priceAdult?: number;
  priceChild?: number;
  groupMin?: number;
  groupMax?: number;
  seasonStartMonth?: number;
  seasonEndMonth?: number;
  inclusions?: string[];
  exclusions?: string[];
  addOns?: PackageAddOn[];
  coverImage?: string;
  privacyPolicyUrl?: string;
  termsAndConditionsUrl?: string;
  status: "Active" | "Draft" | "Deleted";
  createdAt: string;
  updatedAt: string;
}

export interface PackageUpsertInput {
  code: string;
  title: string;
  destination: string;
  duration: string;
  type: string;
  description?: string;
  price?: number;
  priceAdult?: number;
  priceChild?: number;
  groupMin?: number;
  groupMax?: number;
  seasonStartMonth?: number;
  seasonEndMonth?: number;
  inclusions?: string[];
  exclusions?: string[];
  addOns?: PackageAddOn[];
  coverImageUrl?: string;
  privacyPolicyUrl?: string;
  termsAndConditionsUrl?: string;
  status?: string;
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

export interface ItineraryEventInput {
  eventType: string;
  subtype?: string;
  name: string;
  description?: string;
  location?: string;
  eventTime?: string;
  price?: string;
  bookedThrough?: string;
  confirmation?: string;
  carrier?: string;
  amenities?: string[];
  imageUrl?: string;
  sortOrder?: number;
}

export interface ItineraryDayInput {
  dayNumber?: number;
  label: string;
  sublabel: string;
  date?: string;
  events?: ItineraryEventInput[];
}

export interface ItineraryUpsertInput {
  title: string;
  destination: string;
  duration: string;
  dateRange: string;
  idealFor: string;
  category: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  bookingId?: number;
  leadId?: number;
  createdBy?: number;
  days?: ItineraryDayInput[];
}

export const dashboardApi = {
  summary: () => apiFetch<DashboardSummary>("/dashboard/summary"),
};

export const leadsApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    apiFetch<Lead[]>(`/leads${buildQuery(params)}`),
  get: (id: number) => apiFetch<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) =>
    apiFetch<Lead>("/leads", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Lead>) =>
    apiFetch<Lead>(`/leads/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) => apiFetch<void>(`/leads/${id}`, { method: "DELETE" }),
};

export const bookingsApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    apiFetch<Booking[]>(`/bookings${buildQuery(params)}`),
  get: (id: number) => apiFetch<Booking>(`/bookings/${id}`),
  create: (data: Partial<Booking>) =>
    apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<Booking>) =>
    apiFetch<Booking>(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) => apiFetch<void>(`/bookings/${id}`, { method: "DELETE" }),
};

export const packagesApi = {
  list: (params?: { status?: string; search?: string; type?: string; page?: number; limit?: number }) =>
    apiFetch<Package[]>(`/packages${buildQuery(params)}`),
  get: (id: number) => apiFetch<Package>(`/packages/${id}`),
  create: (data: PackageUpsertInput) =>
    apiFetch<Package>("/packages", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<PackageUpsertInput>) =>
    apiFetch<Package>(`/packages/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) => apiFetch<void>(`/packages/${id}`, { method: "DELETE" }),
};

export const itinerariesApi = {
  list: (params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) =>
    apiFetch<Itinerary[]>(`/itineraries${buildQuery(params)}`),
  get: (id: number) => apiFetch<Itinerary>(`/itineraries/${id}`),
  create: (data: ItineraryUpsertInput) =>
    apiFetch<Itinerary>("/itineraries", { method: "POST", body: JSON.stringify(toSnake(data)) }),
  update: (id: number, data: Partial<ItineraryUpsertInput>) =>
    apiFetch<Itinerary>(`/itineraries/${id}`, { method: "PUT", body: JSON.stringify(toSnake(data)) }),
  delete: (id: number) => apiFetch<void>(`/itineraries/${id}`, { method: "DELETE" }),
};
