import React from "react";
import { Plus, PackageOpen } from "lucide-react";
import { packagesPage } from "../../data/packagesData";

interface PackagesEmptyStateProps {
  onCreatePackage: () => void;
}

export function PackagesEmptyState({ onCreatePackage }: PackagesEmptyStateProps) {
  const { emptyState } = packagesPage;

  return (
    <div
      className="packages-empty-state flex flex-col items-center justify-center h-full py-16 gap-4"
      data-component="packages-empty-state"
    >
      {/* Icon container */}
      <div className="packages-empty-state__icon-wrap w-20 h-20 rounded-full bg-[#f3f4f6] flex items-center justify-center">
        <PackageOpen size={36} className="packages-empty-state__icon text-[#9ca3af]" strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <h2 className="packages-empty-state__heading text-[#374151] text-lg m-0">
        {emptyState.heading}
      </h2>

      {/* Paragraph */}
      <p className="packages-empty-state__paragraph text-[#6b7280] text-sm text-center max-w-[420px] m-0 leading-relaxed">
        {emptyState.paragraph}
      </p>

      {/* CTA Button */}
      <button
        className="packages-empty-state__btn flex items-center gap-2 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white px-5 py-3 rounded-lg cursor-pointer border-0 hover:opacity-90 transition-opacity"
        onClick={onCreatePackage}
        data-action="create-package"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span className="packages-empty-state__btn-label font-medium text-sm">
          {emptyState.button.label}
        </span>
      </button>
    </div>
  );
}
