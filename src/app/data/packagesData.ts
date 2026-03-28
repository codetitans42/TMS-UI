// ============================================================
// Packages Module — Structured Data (JSON-compatible)
// Use this as the single source of truth for all UI content.
// Keys map directly to HTML class names for easy integration.
// ============================================================

export const pageConfig = {
  title: "Bookings",
  currentSection: "packages",
  date: {
    label: "Today",
    value: "08 July 2025",
  },
  userAvatar: {
    alt: "User profile",
    src: "", // replace with real avatar URL
  },
};

export const navigation = {
  items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", active: false, href: "#" },
    { id: "bookings", label: "Bookings", icon: "bookings", active: false, href: "#" },
    { id: "packages", label: "Packages", icon: "packages", active: true, href: "#" },
    { id: "leads", label: "Leads", icon: "leads", active: false, href: "#" },
    { id: "itinerary", label: "Itinerary", icon: "itinerary", active: false, href: "#" },
    { id: "quotation", label: "Quotation", icon: "quotation", active: false, href: "#" },
    { id: "support", label: "Support", icon: "support", active: false, href: "#" },
    { id: "settings", label: "Settings", icon: "settings", active: false, href: "#" },
  ],
};

export const packagesPage = {
  tabs: [
    { id: "active", label: "Active" },
    { id: "draft", label: "Draft" },
    { id: "deleted", label: "Deleted" },
  ],
  searchPlaceholder: "Search by Package, Destination...",
  newPackageButton: {
    label: "New Package",
    icon: "plus",
  },
  emptyState: {
    icon: "package-percent",
    heading: "No packages yet",
    paragraph:
      "Create your first package to automatically adjust trip rates based on conditions.",
    button: {
      label: "Create Package",
      icon: "plus",
      variant: "primary",
    },
  },
  table: {
    columns: [
      { id: "select", label: "", type: "checkbox" },
      { id: "packageTitle", label: "Package Title" },
      { id: "code", label: "Code" },
      { id: "duration", label: "Duration" },
      { id: "destination", label: "Destination" },
      { id: "type", label: "Type" },
      { id: "lastUpdated", label: "Last Updated" },
      { id: "actions", label: "" },
    ],
  },
  packages: [
    {
      id: "pkg-001",
      title: "PS1 - ICe Land",
      code: "Q2025-0015",
      duration: "8D/ 7N",
      destination: "Iceland",
      type: "International",
      status: "active",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
    {
      id: "pkg-002",
      title: "PS4- Dubai",
      code: "Q2025-0016",
      duration: "8D/ 7N",
      destination: "Dubai",
      type: "Domestic",
      status: "active",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
    {
      id: "pkg-003",
      title: "PS5 - Canada",
      code: "Q2025-0017",
      duration: "8D/ 7N",
      destination: "Canada",
      type: "International",
      status: "active",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
    {
      id: "pkg-004",
      title: "PS2 - Maldives",
      code: "Q2025-0018",
      duration: "5D/ 4N",
      destination: "Maldives",
      type: "International",
      status: "draft",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
    {
      id: "pkg-005",
      title: "PS3 - Goa",
      code: "Q2025-0019",
      duration: "4D/ 3N",
      destination: "Goa",
      type: "Domestic",
      status: "draft",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
    {
      id: "pkg-006",
      title: "PS6 - Thailand",
      code: "Q2025-0020",
      duration: "6D/ 5N",
      destination: "Thailand",
      type: "International",
      status: "deleted",
      lastUpdated: {
        label: "Edited On",
        date: "Mar 28, 2025",
      },
    },
  ],
  contextMenus: {
    active: [
      { id: "view", label: "View", icon: "eye" },
      { id: "edit", label: "Edit", icon: "edit" },
      { id: "download", label: "Download", icon: "download" },
      { id: "delete", label: "Delete", icon: "trash" },
    ],
    draft: [
      { id: "edit", label: "Edit", icon: "edit" },
      { id: "delete", label: "Delete", icon: "trash" },
    ],
    deleted: [
      { id: "restore", label: "Restore", icon: "restore" },
      { id: "delete-permanently", label: "Delete Permanently", icon: "trash" },
    ],
  },
};

export const createPackageForm = {
  title: "Create New Pacakage",
  backLabel: "Back to Packages",
  steps: [
    { id: 1, label: "General Info" },
    { id: 2, label: "Pricing" },
    { id: 3, label: "Inclusions & Exclusions" },
  ],
  generalInfo: {
    sectionTitle: "General Information",
    fields: [
      {
        id: "packageCode",
        label: "Package Code",
        required: true,
        type: "text",
        placeholder: "790456",
        defaultValue: "790456",
      },
      {
        id: "packageTitle",
        label: "Package Title",
        required: true,
        type: "text",
        placeholder: "Jollyo Gymkhana",
        defaultValue: "Jollyo Gymkhana",
      },
      {
        id: "durationNight",
        label: "Duration(Night)",
        required: true,
        type: "number",
        placeholder: "3",
        defaultValue: "3",
      },
      {
        id: "durationDay",
        label: "Duration(Day)",
        required: true,
        type: "number",
        placeholder: "3",
        defaultValue: "3",
      },
      {
        id: "tripType",
        label: "Trip Type",
        required: true,
        type: "select",
        options: ["International", "Domestic"],
        defaultValue: "International",
      },
      {
        id: "destination",
        label: "Destination",
        required: true,
        type: "text",
        placeholder: "Australia",
        defaultValue: "Australia",
      },
      {
        id: "description",
        label: "Description",
        required: false,
        type: "textarea",
        placeholder: "Brief description of this pricing rule",
        hint: "Optional, max 100 characters",
        maxLength: 100,
      },
      {
        id: "privacyPolicy",
        label: "Privacy Policy",
        required: false,
        type: "file",
        placeholder: "Attachment",
      },
      {
        id: "termsAndCondition",
        label: "Terms & Condition",
        required: false,
        type: "file",
        placeholder: "Attachment",
      },
    ],
    buttons: {
      cancel: { label: "Cancel" },
      next: { label: "Next" },
    },
  },
  pricing: {
    sectionTitle: "Pricing",
    fields: [
      {
        id: "priceAdult",
        label: "Price(Adult)",
        required: true,
        type: "text",
        placeholder: "Rs. 4000",
        defaultValue: "Rs. 4000",
      },
      {
        id: "priceChild",
        label: "Price(Child)",
        required: true,
        type: "text",
        placeholder: "Rs. 1500",
        defaultValue: "Rs. 1500",
      },
    ],
    groupSize: {
      sectionTitle: "Group Size",
      fields: [
        {
          id: "groupMin",
          label: "Minimum",
          required: true,
          type: "number",
          placeholder: "12",
          defaultValue: "12",
        },
        {
          id: "groupMax",
          label: "Maximum",
          required: true,
          type: "number",
          placeholder: "12",
          defaultValue: "12",
        },
      ],
    },
    season: {
      sectionTitle: "Season",
      fields: [
        {
          id: "startMonth",
          label: "Start Month",
          required: true,
          type: "select",
          options: [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December",
          ],
          defaultValue: "April",
        },
        {
          id: "endMonth",
          label: "End Month",
          required: true,
          type: "select",
          options: [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December",
          ],
          defaultValue: "June",
        },
      ],
    },
    buttons: {
      back: { label: "Back" },
      next: { label: "Next" },
    },
  },
  inclusionsExclusions: {
    sectionTitle: "Inclusion & Exclusions",
    inclusion: {
      label: "Inclusion",
      placeholder: "Enter inclusions",
    },
    exclusion: {
      label: "Exclusion",
      placeholder: "Enter Exclusion",
    },
    filterTags: [
      "All","Domestic","International","Honeymoon","Solo","Business","Party",
    ],
    addOns: {
      sectionTitle: "Add-ons",
      serviceLabel: "Service",
      priceLabel: "Price",
      defaultRow: {
        service: "Break Fast",
        price: "₹400.00",
      },
    },
    buttons: {
      back: { label: "Back" },
      save: { label: "Save" },
    },
  },
};
