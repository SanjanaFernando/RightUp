import React from "react";
import FormInput from "../components/FormInput";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Contact({ data, updateData, onNext, onBack }: StepProps) {
  const handleNext = () => {
    if (data.email && data.phone) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Contact Details
        </h2>
        <p className="text-gray-400 text-sm">How can we reach you?</p>
      </div>

      <div className="flex flex-col gap-6 mb-10 flex-1">
        <FormInput
          label="Email Address"
          type="email"
          value={data.email || ""}
          onChange={(val) => updateData({ email: val })}
          placeholder="john.doe@example.com"
          required
        />
        <FormInput
          label="Phone Number"
          type="tel"
          value={data.phone || ""}
          onChange={(val) => updateData({ phone: val })}
          placeholder="+61 400 000 000"
          required
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
          disabled={!data.email || !data.phone}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
