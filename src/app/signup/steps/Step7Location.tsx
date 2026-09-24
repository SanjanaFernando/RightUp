import React from "react";
import FormInput from "../components/FormInput";
import CustomSelect from "../components/CustomSelect";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step7Location({ data, updateData, onNext, onBack }: StepProps) {
  const handleNext = () => {
    if (data.country && data.city) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Location
        </h2>
        <p className="text-gray-400 text-sm">Where are you based?</p>
      </div>

      <div className="flex flex-col gap-6 mb-10 flex-1">
        <CustomSelect
          label="Country"
          placeholder="Select country"
          value={data.country || ""}
          options={[
            "Australia",
            "United States",
            "United Kingdom",
            "Canada",
            "Other",
          ]}
          onChange={(val) => updateData({ country: val })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            label="State / Province"
            value={data.state || ""}
            onChange={(val) => updateData({ state: val })}
            placeholder="NSW"
          />
          <FormInput
            label="City"
            value={data.city || ""}
            onChange={(val) => updateData({ city: val })}
            placeholder="Sydney"
            required
          />
        </div>
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
          disabled={!data.country || !data.city}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
