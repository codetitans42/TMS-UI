import React, { useState } from "react";
import { ArrowLeft, Check, Plus, X } from "lucide-react";

import { PackageAddOn, PackageUpsertInput } from "../../services/api";

interface CreatePackageFormProps {
  onBack: () => void;
  onSave: (data: PackageUpsertInput) => Promise<void> | void;
  saving?: boolean;
  error?: string | null;
}

type Step = 1 | 2 | 3;

interface AddOnDraft {
  id: string;
  service: string;
  price: string;
}

interface FormState {
  code: string;
  title: string;
  destination: string;
  duration: string;
  type: string;
  description: string;
  priceAdult: string;
  priceChild: string;
  groupMin: string;
  groupMax: string;
  seasonStartMonth: string;
  seasonEndMonth: string;
  inclusions: string;
  exclusions: string;
  status: string;
  privacyPolicyUrl: string;
  termsAndConditionsUrl: string;
  addOns: AddOnDraft[];
}

const MONTHS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const INITIAL_STATE: FormState = {
  code: "",
  title: "",
  destination: "",
  duration: "",
  type: "International",
  description: "",
  priceAdult: "",
  priceChild: "",
  groupMin: "",
  groupMax: "",
  seasonStartMonth: "1",
  seasonEndMonth: "12",
  inclusions: "",
  exclusions: "",
  status: "Draft",
  privacyPolicyUrl: "",
  termsAndConditionsUrl: "",
  addOns: [{ id: "addon-1", service: "", price: "" }],
};

function parseNumber(value: string): number | undefined {
  const digits = value.replace(/[^0-9-]/g, "");

  if (!digits) {
    return undefined;
  }

  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { id: 1, label: "General Info" },
    { id: 2, label: "Pricing" },
    { id: 3, label: "Inclusions" },
  ] as const;

  return (
    <div className="flex items-start gap-0">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isDone = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1 min-w-[90px]">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  isActive || isDone
                    ? "bg-[#04706a] border-[#04706a] text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? <Check size={14} /> : step.id}
              </div>
              <span className={`text-xs ${isActive ? "text-[#04706a] font-semibold" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mt-4 mx-1 ${isDone ? "bg-[#04706a]" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function InputLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm text-[#374151] mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function CreatePackageForm({
  onBack,
  onSave,
  saving = false,
  error = null,
}: CreatePackageFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [formError, setFormError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAddOn = (id: string, field: keyof PackageAddOn, value: string) => {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addAddOn = () => {
    setForm((current) => ({
      ...current,
      addOns: [...current.addOns, { id: `addon-${Date.now()}`, service: "", price: "" }],
    }));
  };

  const removeAddOn = (id: string) => {
    setForm((current) => ({
      ...current,
      addOns:
        current.addOns.length === 1
          ? current.addOns.map((item) =>
              item.id === id ? { ...item, service: "", price: "" } : item
            )
          : current.addOns.filter((item) => item.id !== id),
    }));
  };

  const validateStepOne = () => {
    if (!form.code.trim() || !form.title.trim() || !form.destination.trim() || !form.duration.trim()) {
      setFormError("Code, title, destination, and duration are required.");
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    const payload: PackageUpsertInput = {
      code: form.code.trim(),
      title: form.title.trim(),
      destination: form.destination.trim(),
      duration: form.duration.trim(),
      type: form.type,
      description: form.description.trim() || undefined,
      priceAdult: parseNumber(form.priceAdult),
      priceChild: parseNumber(form.priceChild),
      groupMin: parseNumber(form.groupMin),
      groupMax: parseNumber(form.groupMax),
      seasonStartMonth: parseNumber(form.seasonStartMonth),
      seasonEndMonth: parseNumber(form.seasonEndMonth),
      inclusions: parseLines(form.inclusions),
      exclusions: parseLines(form.exclusions),
      addOns: form.addOns
        .map((item) => ({
          service: item.service.trim(),
          price: parseNumber(item.price) ?? 0,
        }))
        .filter((item) => item.service),
      privacyPolicyUrl: form.privacyPolicyUrl.trim() || undefined,
      termsAndConditionsUrl: form.termsAndConditionsUrl.trim() || undefined,
      status: form.status,
    };

    payload.price = payload.priceAdult;

    await onSave(payload);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#04706a]/40 focus:border-[#04706a] bg-white";

  return (
    <div className="create-package-form" data-component="create-package-form">
      <button
        className="flex items-center gap-2 text-sm text-[#374151] mb-6 border-0 bg-transparent cursor-pointer hover:text-[#04706a] p-0"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        <span>Create New Package</span>
      </button>

      <div className="mb-8">
        <StepIndicator currentStep={step} />
      </div>

      {(formError || error) && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError || error}
        </div>
      )}

      {step === 1 && (
        <section className="grid grid-cols-2 gap-5">
          <div>
            <InputLabel required>Package Code</InputLabel>
            <input value={form.code} onChange={(event) => updateField("code", event.target.value)} className={inputClass} />
          </div>
          <div>
            <InputLabel required>Package Title</InputLabel>
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className={inputClass} />
          </div>
          <div>
            <InputLabel required>Duration</InputLabel>
            <input
              value={form.duration}
              onChange={(event) => updateField("duration", event.target.value)}
              placeholder="5 Days / 4 Nights"
              className={inputClass}
            />
          </div>
          <div>
            <InputLabel required>Destination</InputLabel>
            <input value={form.destination} onChange={(event) => updateField("destination", event.target.value)} className={inputClass} />
          </div>
          <div>
            <InputLabel required>Trip Type</InputLabel>
            <select value={form.type} onChange={(event) => updateField("type", event.target.value)} className={inputClass}>
              <option value="International">International</option>
              <option value="Domestic">Domestic</option>
            </select>
          </div>
          <div>
            <InputLabel>Status</InputLabel>
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className={inputClass}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div className="col-span-2">
            <InputLabel>Description</InputLabel>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Short package summary"
            />
          </div>
          <div className="col-span-2 flex justify-between mt-2">
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
              onClick={onBack}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 cursor-pointer border-0"
              onClick={() => {
                if (validateStepOne()) {
                  setStep(2);
                }
              }}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <InputLabel>Price (Adult)</InputLabel>
              <input value={form.priceAdult} onChange={(event) => updateField("priceAdult", event.target.value)} className={inputClass} placeholder="40000" />
            </div>
            <div>
              <InputLabel>Price (Child)</InputLabel>
              <input value={form.priceChild} onChange={(event) => updateField("priceChild", event.target.value)} className={inputClass} placeholder="25000" />
            </div>
            <div>
              <InputLabel>Group Min</InputLabel>
              <input value={form.groupMin} onChange={(event) => updateField("groupMin", event.target.value)} className={inputClass} />
            </div>
            <div>
              <InputLabel>Group Max</InputLabel>
              <input value={form.groupMax} onChange={(event) => updateField("groupMax", event.target.value)} className={inputClass} />
            </div>
            <div>
              <InputLabel>Season Start Month</InputLabel>
              <select value={form.seasonStartMonth} onChange={(event) => updateField("seasonStartMonth", event.target.value)} className={inputClass}>
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <InputLabel>Season End Month</InputLabel>
              <select value={form.seasonEndMonth} onChange={(event) => updateField("seasonEndMonth", event.target.value)} className={inputClass}>
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 cursor-pointer border-0"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <InputLabel>Inclusions</InputLabel>
              <textarea
                value={form.inclusions}
                onChange={(event) => updateField("inclusions", event.target.value)}
                rows={6}
                className={`${inputClass} resize-none`}
                placeholder="One item per line"
              />
            </div>
            <div>
              <InputLabel>Exclusions</InputLabel>
              <textarea
                value={form.exclusions}
                onChange={(event) => updateField("exclusions", event.target.value)}
                rows={6}
                className={`${inputClass} resize-none`}
                placeholder="One item per line"
              />
            </div>
            <div>
              <InputLabel>Privacy Policy URL</InputLabel>
              <input
                value={form.privacyPolicyUrl}
                onChange={(event) => updateField("privacyPolicyUrl", event.target.value)}
                className={inputClass}
                placeholder="https://example.com/privacy"
              />
            </div>
            <div>
              <InputLabel>Terms & Conditions URL</InputLabel>
              <input
                value={form.termsAndConditionsUrl}
                onChange={(event) => updateField("termsAndConditionsUrl", event.target.value)}
                className={inputClass}
                placeholder="https://example.com/terms"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Add-ons</h2>
              <button
                onClick={addAddOn}
                className="flex items-center gap-1 text-sm text-[#04706a] bg-transparent border-0 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Row</span>
              </button>
            </div>
            <div className="space-y-3">
              {form.addOns.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_180px_auto] gap-3 items-center">
                  <input
                    value={item.service}
                    onChange={(event) => updateAddOn(item.id, "service", event.target.value)}
                    className={inputClass}
                    placeholder="Service name"
                  />
                  <input
                    value={item.price}
                    onChange={(event) => updateAddOn(item.id, "price", event.target.value)}
                    className={inputClass}
                    placeholder="2500"
                  />
                  <button
                    onClick={() => removeAddOn(item.id)}
                    className="w-10 h-10 rounded-full border border-[#04706a] text-[#04706a] flex items-center justify-center bg-white cursor-pointer hover:bg-[#04706a] hover:text-white"
                    aria-label="Remove add-on"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer bg-white"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="px-8 py-2.5 bg-gradient-to-b from-[#04706a] to-[#b8cbca] text-white rounded-lg text-sm hover:opacity-90 cursor-pointer border-0 disabled:opacity-70"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Package"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
