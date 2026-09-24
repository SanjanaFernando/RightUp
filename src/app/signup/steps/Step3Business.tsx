import React from "react";
import FormInput from "../components/FormInput";
import CustomSelect from "../components/CustomSelect";

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
        <CustomSelect
          label="4. Select what best describes your current business or professional stage"
          placeholder="Select stage"
          value={data.stage || ""}
          options={[
            "Idea / Pre-seed",
            "Startup / Seed",
            "Growth / Series A+",
            "Established Enterprise",
            "Independent Professional",
          ]}
          onChange={(val) => updateData({ stage: val })}
          required
        />

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
