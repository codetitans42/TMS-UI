import React, { useState } from "react";
import { ArrowLeft, Check, Paperclip, Plus, X } from "lucide-react";
import { createPackageForm } from "../../data/packagesData";

interface CreatePackageFormProps {
  onBack: () => void;
  onSave: () => void;
}

interface AddOn {
  id: string;
  service: string;
  price: string;
}

const TRIP_TYPES = ["International", "Domestic"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const FILTER_TAGS = ["All","Domestic","International","Honeymoon","Solo","Business","Party"];

// ── Step Indicator ──────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  const { steps } = createPackageForm;
  return (
    <div className="step-indicator flex items-start gap-0" data-component="step-indicator">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="step-indicator__step flex flex-col items-center gap-1 min-w-[80px]">
              <div
                className={`step-indicator__circle w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors
                  ${isCompleted
                    ? "step-indicator__circle--completed bg-[#04706a] border-[#04706a] text-white"
                    : isActive
                    ? "step-indicator__circle--active bg-[#04706a] border-[#04706a] text-white"
                    : "step-indicator__circle--inactive bg-white border-gray-300 text-gray-400"
                  }`}
                data-step={step.id}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </div>
              <span
                className={`step-indicator__label text-xs whitespace-nowrap
                  ${isActive
                    ? "step-indicator__label--active text-[#04706a] font-semibold"
                    : isCompleted
                    ? "step-indicator__label--completed text-[#04706a]"
                    : "step-indicator__label--inactive text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`step-indicator__connector flex-1 h-0.5 mt-4 mx-1 transition-colors
                  ${currentStep > step.id
                    ? "step-indicator__connector--done bg-[#04706a]"
                    : "step-indicator__connector--pending bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Form Field helpers ───────────────────────────────────────────────
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="form-field__label block text-sm text-[#374151] mb-1">
      {label}
      {required && <span className="form-field__required text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  id, value, onChange, placeholder, required,
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="form-field__input w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/40 focus:border-[#04706a]"
      data-field-id={id}
    />
  );
}

function SelectInput({
  id, value, onChange, options, required,
}: {
  id: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="form-field__select w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/40 focus:border-[#04706a] bg-white appearance-none cursor-pointer"
      data-field-id={id}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function FileInput({ id, label }: { id: string; label: string }) {
  return (
    <div className="file-input relative" data-field-id={id}>
      <input
        type="text"
        placeholder="Attachment"
        readOnly
        className="form-field__file-input w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-pointer"
      />
      <button
        className="form-field__file-btn absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#04706a] border-0 bg-transparent cursor-pointer"
        aria-label={`Attach ${label}`}
      >
        <Paperclip size={16} />
      </button>
    </div>
  );
}

// ── Step 1: General Info ─────────────────────────────────────────────
function GeneralInfoStep({
  onNext, onCancel,
}: {
  onNext: () => void; onCancel: () => void;
}) {
  const [packageCode, setPackageCode] = useState("790456");
  const [packageTitle, setPackageTitle] = useState("Jollyo Gymkhana");
  const [durationNight, setDurationNight] = useState("3");
  const [durationDay, setDurationDay] = useState("3");
  const [tripType, setTripType] = useState("International");
  const [destination, setDestination] = useState("Australia");
  const [description, setDescription] = useState("");

  const charCount = description.length;

  return (
    <section className="general-info-step" data-step="1">
      <h2 className="general-info-step__title text-base font-semibold text-[#1a1a1a] mb-5">
        {createPackageForm.generalInfo.sectionTitle}
      </h2>

      <div className="general-info-step__grid grid grid-cols-2 gap-x-5 gap-y-4">
        {/* Package Code */}
        <div className="form-field" data-field="packageCode">
          <FieldLabel label="Package Code" required />
          <TextInput id="packageCode" value={packageCode} onChange={setPackageCode} required />
        </div>

        {/* Package Title */}
        <div className="form-field" data-field="packageTitle">
          <FieldLabel label="Package Title" required />
          <TextInput id="packageTitle" value={packageTitle} onChange={setPackageTitle} required />
        </div>

        {/* Duration Night */}
        <div className="form-field" data-field="durationNight">
          <FieldLabel label="Duration(Night)" required />
          <TextInput id="durationNight" value={durationNight} onChange={setDurationNight} required />
        </div>

        {/* Duration Day */}
        <div className="form-field" data-field="durationDay">
          <FieldLabel label="Duration(Day)" required />
          <TextInput id="durationDay" value={durationDay} onChange={setDurationDay} required />
        </div>

        {/* Trip Type */}
        <div className="form-field" data-field="tripType">
          <FieldLabel label="Trip Type" required />
          <div className="relative">
            <SelectInput
              id="tripType"
              value={tripType}
              onChange={setTripType}
              options={TRIP_TYPES}
              required
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>
        </div>

        {/* Destination */}
        <div className="form-field" data-field="destination">
          <FieldLabel label="Destination" required />
          <TextInput id="destination" value={destination} onChange={setDestination} required />
        </div>
      </div>

      {/* Description */}
      <div className="form-field mt-4" data-field="description">
        <div className="flex items-baseline gap-2 mb-1">
          <label className="form-field__label text-sm text-[#374151]">Description</label>
          <span className="text-xs text-gray-400">Optional, max 100 characters</span>
        </div>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 100))}
          placeholder="Brief description of this pricing rule"
          rows={4}
          className="form-field__textarea w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/40 focus:border-[#04706a] resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{charCount}/100 characters</p>
      </div>

      {/* Attachments */}
      <div className="form-field__attachments grid grid-cols-2 gap-5 mt-4">
        <div className="form-field" data-field="privacyPolicy">
          <FieldLabel label="Privacy Policy" />
          <FileInput id="privacyPolicy" label="Privacy Policy" />
        </div>
        <div className="form-field" data-field="termsAndCondition">
          <FieldLabel label="Terms & Condition" />
          <FileInput id="termsAndCondition" label="Terms & Condition" />
        </div>
      </div>

      {/* Buttons */}
      <div className="form-actions flex justify-between mt-8" data-component="form-actions">
        <button
          className="form-actions__cancel-btn px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
          onClick={onCancel}
          data-action="cancel"
        >
          {createPackageForm.generalInfo.buttons.cancel.label}
        </button>
        <button
          className="form-actions__next-btn px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer border-0"
          onClick={onNext}
          data-action="next"
        >
          {createPackageForm.generalInfo.buttons.next.label}
        </button>
      </div>
    </section>
  );
}

// ── Step 2: Pricing ──────────────────────────────────────────────────
function PricingStep({
  onNext, onBack,
}: {
  onNext: () => void; onBack: () => void;
}) {
  const [priceAdult, setPriceAdult] = useState("Rs. 4000");
  const [priceChild, setPriceChild] = useState("Rs. 1500");
  const [groupMin, setGroupMin] = useState("12");
  const [groupMax, setGroupMax] = useState("12");
  const [startMonth, setStartMonth] = useState("April");
  const [endMonth, setEndMonth] = useState("June");

  return (
    <section className="pricing-step" data-step="2">
      {/* Pricing */}
      <h2 className="pricing-step__title text-base font-semibold text-[#1a1a1a] mb-5">
        {createPackageForm.pricing.sectionTitle}
      </h2>
      <div className="pricing-step__grid grid grid-cols-2 gap-5">
        <div className="form-field" data-field="priceAdult">
          <FieldLabel label="Price(Adult)" required />
          <TextInput id="priceAdult" value={priceAdult} onChange={setPriceAdult} required />
        </div>
        <div className="form-field" data-field="priceChild">
          <FieldLabel label="Price(Child)" required />
          <TextInput id="priceChild" value={priceChild} onChange={setPriceChild} required />
        </div>
      </div>

      {/* Group Size */}
      <h2 className="pricing-step__group-title text-base font-semibold text-[#1a1a1a] mt-6 mb-5">
        {createPackageForm.pricing.groupSize.sectionTitle}
      </h2>
      <div className="pricing-step__group-grid grid grid-cols-2 gap-5">
        <div className="form-field" data-field="groupMin">
          <FieldLabel label="Minimum" required />
          <TextInput id="groupMin" value={groupMin} onChange={setGroupMin} required />
        </div>
        <div className="form-field" data-field="groupMax">
          <FieldLabel label="Maximum" required />
          <TextInput id="groupMax" value={groupMax} onChange={setGroupMax} required />
        </div>
      </div>

      {/* Season */}
      <h2 className="pricing-step__season-title text-base font-semibold text-[#1a1a1a] mt-6 mb-5">
        {createPackageForm.pricing.season.sectionTitle}
      </h2>
      <div className="pricing-step__season-grid grid grid-cols-2 gap-5">
        <div className="form-field" data-field="startMonth">
          <FieldLabel label="Start Month" required />
          <div className="relative">
            <SelectInput id="startMonth" value={startMonth} onChange={setStartMonth} options={MONTHS} required />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>
        </div>
        <div className="form-field" data-field="endMonth">
          <FieldLabel label="End Month" required />
          <div className="relative">
            <SelectInput id="endMonth" value={endMonth} onChange={setEndMonth} options={MONTHS} required />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="form-actions flex justify-between mt-8" data-component="form-actions">
        <button
          className="form-actions__back-btn px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
          onClick={onBack}
          data-action="back"
        >
          {createPackageForm.pricing.buttons.back.label}
        </button>
        <button
          className="form-actions__next-btn px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer border-0"
          onClick={onNext}
          data-action="next"
        >
          {createPackageForm.pricing.buttons.next.label}
        </button>
      </div>
    </section>
  );
}

// ── Step 3: Inclusions & Exclusions ─────────────────────────────────
function InclusionsExclusionsStep({
  onSave, onBack,
}: {
  onSave: () => void; onBack: () => void;
}) {
  const [inclusionText, setInclusionText] = useState("");
  const [exclusionText, setExclusionText] = useState("");
  const [inclFilter, setInclFilter] = useState("All");
  const [exclFilter, setExclFilter] = useState("All");
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: "ao-1", service: "Break Fast", price: "₹400.00" },
  ]);

  const addRow = () => {
    setAddOns((prev) => [
      ...prev,
      { id: `ao-${Date.now()}`, service: "", price: "" },
    ]);
  };

  const removeRow = (id: string) => {
    setAddOns((prev) => prev.filter((a) => a.id !== id));
  };

  const updateRow = (id: string, field: "service" | "price", value: string) => {
    setAddOns((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  return (
    <section className="inclusions-exclusions-step" data-step="3">
      <h2 className="inclusions-exclusions-step__title text-base font-semibold text-[#1a1a1a] mb-5">
        {createPackageForm.inclusionsExclusions.sectionTitle}
      </h2>

      <div className="inclusions-exclusions-step__grid grid grid-cols-2 gap-5">
        {/* Inclusion Panel */}
        <div
          className="inclusion-panel border border-gray-200 rounded-xl p-4"
          data-component="inclusion-panel"
        >
          <h3 className="inclusion-panel__label text-sm font-medium text-[#374151] mb-3">
            {createPackageForm.inclusionsExclusions.inclusion.label}
          </h3>
          <input
            type="text"
            value={inclusionText}
            onChange={(e) => setInclusionText(e.target.value)}
            placeholder={createPackageForm.inclusionsExclusions.inclusion.placeholder}
            className="inclusion-panel__input w-full border-0 border-b border-gray-200 pb-2 text-sm text-gray-600 focus:outline-none focus:border-[#04706a] bg-transparent mb-4"
          />
          {/* Filter tags */}
          <div className="inclusion-panel__tags flex flex-wrap gap-2" data-component="filter-tags">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setInclFilter(tag)}
                className={`filter-tag px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors
                  ${inclFilter === tag
                    ? "filter-tag--active bg-[#04706a] text-white border-[#04706a]"
                    : "filter-tag--inactive bg-white text-[#374151] border-gray-300 hover:border-[#04706a]"
                  }`}
                data-tag={tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Exclusion Panel */}
        <div
          className="exclusion-panel border border-gray-200 rounded-xl p-4"
          data-component="exclusion-panel"
        >
          <h3 className="exclusion-panel__label text-sm font-medium text-[#374151] mb-3">
            {createPackageForm.inclusionsExclusions.exclusion.label}
          </h3>
          <input
            type="text"
            value={exclusionText}
            onChange={(e) => setExclusionText(e.target.value)}
            placeholder={createPackageForm.inclusionsExclusions.exclusion.placeholder}
            className="exclusion-panel__input w-full border-0 border-b border-gray-200 pb-2 text-sm text-gray-600 focus:outline-none focus:border-[#04706a] bg-transparent mb-4"
          />
          <div className="exclusion-panel__tags flex flex-wrap gap-2" data-component="filter-tags">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setExclFilter(tag)}
                className={`filter-tag px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors
                  ${exclFilter === tag
                    ? "filter-tag--active bg-[#04706a] text-white border-[#04706a]"
                    : "filter-tag--inactive bg-white text-[#374151] border-gray-300 hover:border-[#04706a]"
                  }`}
                data-tag={tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="add-ons mt-6" data-component="add-ons">
        <h2 className="add-ons__title text-base font-semibold text-[#1a1a1a] mb-4">
          {createPackageForm.inclusionsExclusions.addOns.sectionTitle}
        </h2>

        <div className="add-ons__header grid grid-cols-[1fr_1fr_auto] gap-3 mb-2">
          <span className="add-ons__col-label text-sm text-gray-500">
            {createPackageForm.inclusionsExclusions.addOns.serviceLabel}
          </span>
          <span className="add-ons__col-label text-sm text-gray-500">
            {createPackageForm.inclusionsExclusions.addOns.priceLabel}
          </span>
          <span />
        </div>

        {addOns.map((row) => (
          <div
            key={row.id}
            className="add-ons__row grid grid-cols-[1fr_1fr_auto] gap-3 mb-3 items-center"
            data-addon-id={row.id}
          >
            <input
              type="text"
              value={row.service}
              onChange={(e) => updateRow(row.id, "service", e.target.value)}
              placeholder="Service name"
              className="add-ons__service-input border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#04706a]/40 focus:border-[#04706a]"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(row.id, "price", e.target.value)}
              placeholder="₹0.00"
              className="add-ons__price-input border border-[#04706a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#04706a]/40"
            />
            <button
              onClick={addOns.length === 1 ? addRow : () => removeRow(row.id)}
              className="add-ons__action-btn w-8 h-8 rounded-full border-2 border-[#04706a] text-[#04706a] flex items-center justify-center hover:bg-[#04706a] hover:text-white transition-colors cursor-pointer bg-transparent"
              aria-label={addOns.length === 1 ? "Add row" : "Remove row"}
            >
              {addOns.length === 1 ? <Plus size={14} /> : <X size={14} />}
            </button>
          </div>
        ))}

        {addOns.length > 1 && (
          <button
            onClick={addRow}
            className="add-ons__add-btn flex items-center gap-2 text-[#04706a] text-sm mt-2 border-0 bg-transparent cursor-pointer hover:underline"
          >
            <Plus size={14} /> Add another
          </button>
        )}
      </div>

      {/* Buttons */}
      <div className="form-actions flex justify-between mt-8" data-component="form-actions">
        <button
          className="form-actions__back-btn px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
          onClick={onBack}
          data-action="back"
        >
          {createPackageForm.inclusionsExclusions.buttons.back.label}
        </button>
        <button
          className="form-actions__save-btn px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer border-0"
          onClick={onSave}
          data-action="save"
        >
          {createPackageForm.inclusionsExclusions.buttons.save.label}
        </button>
      </div>
    </section>
  );
}

// ── Main CreatePackageForm ───────────────────────────────────────────
export function CreatePackageForm({ onBack, onSave }: CreatePackageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="create-package-form" data-component="create-package-form">
      {/* Back link */}
      <button
        className="create-package-form__back-link flex items-center gap-2 text-sm text-[#374151] mb-6 border-0 bg-transparent cursor-pointer hover:text-[#04706a] transition-colors p-0"
        onClick={onBack}
        data-action="back-to-list"
      >
        <ArrowLeft size={16} />
        <span>{createPackageForm.title}</span>
      </button>

      {/* Step Indicator */}
      <div className="create-package-form__stepper mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Form Content */}
      <div className="create-package-form__content">
        {currentStep === 1 && (
          <GeneralInfoStep
            onNext={() => setCurrentStep(2)}
            onCancel={onBack}
          />
        )}
        {currentStep === 2 && (
          <PricingStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <InclusionsExclusionsStep
            onSave={onSave}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}
