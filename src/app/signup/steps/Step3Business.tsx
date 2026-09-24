import React from "react";
import FormInput from "../components/FormInput";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Business({ data, updateData, onNext, onBack }: StepProps) {
  const handleNext = () => {
    if (data.stage && data.strengths) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      
      <div className="flex flex-col gap-8 mb-10 flex-1">
        {/* Stage Dropdown */}
        <div>
          <label className="block text-[15px] text-gray-200 mb-2.5">
            4. Select what best describes your current business or professional stage <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.stage || ""}
              onChange={(e) => updateData({ stage: e.target.value })}
              className="w-full bg-[#0F1627] border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/50 transition-all duration-300"
            >
              <option value="" disabled>Select stage</option>
              <option value="Idea / Pre-seed">Idea / Pre-seed</option>
              <option value="Startup / Seed">Startup / Seed</option>
              <option value="Growth / Series A+">Growth / Series A+</option>
              <option value="Established Enterprise">Established Enterprise</option>
              <option value="Independent Professional">Independent Professional</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div>
          <FormInput
            label="5. Key Strengths"
            value={data.strengths || ""}
            onChange={(val) => updateData({ strengths: val })}
            placeholder="Describe your key strengths"
            isTextarea
            required
          />
        </div>

        {/* Challenges */}
        <div>
          <FormInput
            label="6. Current Challenges"
            value={data.challenges || ""}
            onChange={(val) => updateData({ challenges: val })}
            placeholder="Where do you need support right now?"
            isTextarea
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
          disabled={!data.stage || !data.strengths}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
