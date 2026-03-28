import React, { useState } from "react";
import { Copy, Check, Code2, FileJson, ArrowRight } from "lucide-react";

const HTML_SNIPPET = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bookings – Packages</title>
  <link rel="stylesheet" href="packages.css" />
</head>
<body>
<div class="layout" data-component="app-layout">

  <!-- SIDEBAR — maps to: navigation.items[] -->
  <aside class="layout__sidebar sidebar" data-component="sidebar">
    <nav class="sidebar__nav" aria-label="Main navigation">
      <ul class="sidebar__nav-list">
        <li>
          <a class="sidebar__nav-link sidebar__nav-link--active"
             data-nav-id="packages" aria-current="page">
            Packages
          </a>
        </li>
        <!-- repeat for each navigation.items[] entry -->
      </ul>
    </nav>
  </aside>

  <!-- TOP BAR — maps to: pageConfig -->
  <header class="topbar" data-component="topbar">
    <h1 class="topbar__title" data-content="page-title">Bookings</h1>
    <div class="topbar__right">
      <span data-content="date-value">08 July 2025</span>
      <div class="topbar__avatar" data-content="user-avatar">AD</div>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <main class="packages-page" data-page="packages-list">

    <!-- TABS — maps to: packagesPage.tabs[] -->
    <nav class="packages-page__tabs" role="tablist">
      <button class="packages-page__tab packages-page__tab--active"
              role="tab" data-tab="active">Active</button>
      <button class="packages-page__tab packages-page__tab--inactive"
              role="tab" data-tab="draft">Draft</button>
      <button class="packages-page__tab packages-page__tab--inactive"
              role="tab" data-tab="deleted">Deleted</button>
    </nav>

    <!-- TABLE — maps to: packagesPage.packages[] -->
    <table class="packages-table__table" data-component="packages-table">
      <thead>
        <tr class="packages-table__header-row">
          <th class="packages-table__th" data-col-id="packageTitle">
            Package Title
          </th>
          <!-- ... more columns -->
        </tr>
      </thead>
      <tbody>
        <!-- REPEATED per packages[] item -->
        <tr class="packages-table__row"
            data-pkg-id="pkg-001" data-pkg-status="active">
          <td class="packages-table__td">PS1 - ICe Land</td>
          <!-- ... more cells -->
          <td class="packages-table__td packages-table__td--actions">
            <!-- CONTEXT MENU — maps to: contextMenus.active[] -->
            <div class="context-menu" data-component="context-menu"
                 data-tab="active" role="menu">
              <button class="context-menu__item context-menu__item--primary"
                      data-action="view">View</button>
              <button class="context-menu__item context-menu__item--default"
                      data-action="edit">Edit</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </main>
</div>
</body>
</html>`;

const JSON_SNIPPET = `{
  "pageConfig": {
    "title": "Bookings",
    "date": { "label": "Today", "value": "08 July 2025" }
  },
  "navigation": {
    "items": [
      { "id": "dashboard", "label": "Dashboard", "active": false },
      { "id": "packages",  "label": "Packages",  "active": true  }
    ]
  },
  "packagesPage": {
    "tabs": [
      { "id": "active",  "label": "Active"  },
      { "id": "draft",   "label": "Draft"   },
      { "id": "deleted", "label": "Deleted" }
    ],
    "emptyState": {
      "heading": "No packages yet",
      "paragraph": "Create your first package...",
      "button": { "label": "Create Package" }
    },
    "packages": [
      {
        "id": "pkg-001",
        "title": "PS1 - ICe Land",
        "code": "Q2025-0015",
        "duration": "8D/ 7N",
        "destination": "Iceland",
        "type": "International",
        "status": "active",
        "lastUpdated": { "label": "Edited On", "date": "Mar 28, 2025" }
      }
    ],
    "contextMenus": {
      "active":  [{ "id": "view" }, { "id": "edit" }, { "id": "delete" }],
      "draft":   [{ "id": "edit" }, { "id": "delete" }],
      "deleted": [{ "id": "restore" }, { "id": "delete-permanently" }]
    }
  },
  "createPackageForm": {
    "steps": [
      { "id": 1, "label": "General Info" },
      { "id": 2, "label": "Pricing" },
      { "id": 3, "label": "Inclusions & Exclusions" }
    ]
  }
}`;

const MAPPING = [
  { html: 'data-nav-id="packages"', json: "navigation.items[].id", desc: "Sidebar nav item identifier" },
  { html: 'data-content="page-title"', json: "pageConfig.title", desc: "Page heading in top bar" },
  { html: 'data-content="date-value"', json: "pageConfig.date.value", desc: "Date shown in top bar" },
  { html: 'data-tab="active|draft|deleted"', json: "packagesPage.tabs[].id", desc: "Tab state switcher" },
  { html: 'data-col-id="packageTitle"', json: "packagesPage.table.columns[].id", desc: "Table column binding" },
  { html: 'data-pkg-id="pkg-001"', json: "packagesPage.packages[].id", desc: "Table row unique key" },
  { html: 'data-pkg-status="active"', json: "packagesPage.packages[].status", desc: "Row status for tab filtering" },
  { html: 'data-component="context-menu"', json: "packagesPage.contextMenus[tab]", desc: "3-dot dropdown actions per tab" },
  { html: 'data-action="view|edit|delete"', json: "packagesPage.contextMenus.active[].id", desc: "Context menu action" },
  { html: 'data-step="1|2|3"', json: "createPackageForm.steps[].id", desc: "Multi-step form step" },
  { html: 'data-field="packageCode"', json: "createPackageForm.generalInfo.fields[].id", desc: "Form field binding" },
  { html: 'data-content="empty-heading"', json: "packagesPage.emptyState.heading", desc: "Empty state title" },
  { html: 'data-action="create-package"', json: "packagesPage.emptyState.button.action", desc: "CTA button action key" },
  { html: 'data-addon-id="ao-1"', json: "createPackageForm.inclusionsExclusions.addOns.defaultRows[].id", desc: "Add-on row key" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md border-0 cursor-pointer transition-colors"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

type TabKey = "html" | "json" | "mapping";

export function OutputViewer() {
  const [tab, setTab] = useState<TabKey>("html");

  return (
    <div className="output-viewer flex flex-col gap-4" data-component="output-viewer">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-5">
        <Code2 size={20} className="text-[#04706a]" />
        <h2 className="text-base font-semibold text-[#1a1a1a] m-0">Generated Output</h2>
        <span className="text-xs bg-[#04706a]/10 text-[#04706a] px-2 py-0.5 rounded-full">Antigravity-ready</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6">
        {(["html", "json", "mapping"] as TabKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm border-0 cursor-pointer transition-colors font-medium
              ${tab === t
                ? "bg-[#04706a] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {t === "html" ? "HTML Output" : t === "json" ? "JSON Data" : "HTML ↔ JSON Map"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "html" && (
        <div className="mx-6 rounded-xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e]">
            <span className="text-xs text-gray-400 font-mono">packages-output.html</span>
            <CopyButton text={HTML_SNIPPET} />
          </div>
          <pre className="overflow-x-auto bg-[#282a36] text-[#f8f8f2] p-4 text-xs leading-relaxed m-0 max-h-[460px] overflow-y-auto font-mono">
            <code>{HTML_SNIPPET}</code>
          </pre>
        </div>
      )}

      {tab === "json" && (
        <div className="mx-6 rounded-xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e]">
            <div className="flex items-center gap-2">
              <FileJson size={14} className="text-yellow-400" />
              <span className="text-xs text-gray-400 font-mono">packages-data.json</span>
            </div>
            <CopyButton text={JSON_SNIPPET} />
          </div>
          <pre className="overflow-x-auto bg-[#282a36] text-[#f8f8f2] p-4 text-xs leading-relaxed m-0 max-h-[460px] overflow-y-auto font-mono">
            <code>{JSON_SNIPPET}</code>
          </pre>
        </div>
      )}

      {tab === "mapping" && (
        <div className="mx-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-500 m-0">
              Every <code className="bg-gray-100 px-1 rounded text-[#04706a]">data-*</code> attribute in HTML maps to a key in the JSON file. Replace content from JSON without touching markup.
            </p>
          </div>
          <div className="divide-y divide-gray-100 max-h-[440px] overflow-y-auto">
            {MAPPING.map((row, i) => (
              <div key={i} className="grid grid-cols-[auto_auto_1fr] gap-4 items-start px-4 py-3">
                <code className="text-[11px] bg-[#eafff9] text-[#04706a] px-2 py-0.5 rounded whitespace-nowrap">{row.html}</code>
                <div className="flex items-center text-gray-300 self-center">
                  <ArrowRight size={12} />
                </div>
                <div>
                  <code className="text-[11px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{row.json}</code>
                  <p className="text-xs text-gray-500 mt-0.5 m-0">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
