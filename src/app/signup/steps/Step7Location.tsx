import React from "react";
import FormInput from "../components/FormInput";

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
        <div>
          <label className="block text-[15px] text-gray-200 mb-2.5">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.country || ""}
              onChange={(e) => updateData({ country: e.target.value })}
              className="w-full bg-[#0F1627] border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/50 transition-all duration-300"
            >
              <option value="" disabled>Select country</option>
              <option value="Australia">Australia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

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
