import React from "react";
import FormInput from "../components/FormInput";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step8Socials({ data, updateData, onNext, onBack }: StepProps) {
  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Social Links
        </h2>
        <p className="text-gray-400 text-sm">Help others find you online. (Optional)</p>
      </div>

      <div className="flex flex-col gap-6 mb-10 flex-1">
        <FormInput
          label="LinkedIn Profile URL"
          type="url"
          value={data.linkedin || ""}
          onChange={(val) => updateData({ linkedin: val })}
          placeholder="https://linkedin.com/in/username"
        />
        <FormInput
          label="Twitter / X Profile URL"
          type="url"
          value={data.twitter || ""}
          onChange={(val) => updateData({ twitter: val })}
          placeholder="https://twitter.com/username"
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
          onClick={onNext}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
