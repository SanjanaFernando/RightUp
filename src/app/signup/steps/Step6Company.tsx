import React from "react";
import FormInput from "../components/FormInput";
import CustomSelect from "../components/CustomSelect";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step6Company({ data, updateData, onNext, onBack }: StepProps) {
  const handleNext = () => {
    if (data.companyName && data.industry) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Company Details
        </h2>
        <p className="text-gray-400 text-sm">Tell us about your organization.</p>
      </div>

      <div className="flex flex-col gap-6 mb-10 flex-1">
        <FormInput
          label="Company Name"
          value={data.companyName || ""}
          onChange={(val) => updateData({ companyName: val })}
          placeholder="RightUp Pty Ltd"
          required
        />
        
        <CustomSelect
          label="Industry"
          placeholder="Select industry"
          value={data.industry || ""}
          options={[
            "Technology",
            "Finance",
            "Healthcare",
            "Real Estate",
            "Consulting",
            "Other",
          ]}
          onChange={(val) => updateData({ industry: val })}
          required
        />

        <FormInput
          label="Website URL"
          type="url"
          value={data.website || ""}
          onChange={(val) => updateData({ website: val })}
          placeholder="https://example.com"
        />
      </div>

      <div className="mt-auto flex gap-4">
        <button
          onClick={onBack}
          className="w-1/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 bg-transparent border border-white/20 hover:border-white/50 text-white"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!data.companyName || !data.industry}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
