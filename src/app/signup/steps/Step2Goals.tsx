import React, { useState } from "react";
import CheckboxOption from "../components/CheckboxOption";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  "Connect with industry leaders",
  "Find potential clients",
  "Seek funding or investment",
  "Discover new talent",
  "Stay updated on market trends",
  "Access exclusive resources",
];

export default function Step2Goals({ data, updateData, onNext, onBack }: StepProps) {
  const [otherText, setOtherText] = useState("");
  
  const goals: string[] = data.goals || [];
  const hasOther = goals.some(g => !OPTIONS.includes(g) && g !== "");
  const otherValue = goals.find(g => !OPTIONS.includes(g)) || "";

  const toggleGoal = (val: string) => {
    if (goals.includes(val)) {
      updateData({ goals: goals.filter(g => g !== val) });
    } else {
      updateData({ goals: [...goals, val] });
    }
  };

  const handleNext = () => {
    if (goals.length > 0) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          2. Why do you want to join Right Up? <span className="text-red-500 font-normal text-sm ml-2">(Required)</span>
        </h2>
        <p className="text-gray-400 text-sm">(Multi-select)</p>
      </div>

      <div className="flex flex-col gap-3 mb-10 flex-1">
        {OPTIONS.map((opt) => (
          <CheckboxOption
            key={opt}
            label={opt}
            selected={goals.includes(opt)}
            onClick={() => toggleGoal(opt)}
          />
        ))}
        
        {/* Other Option */}
        <CheckboxOption
          label="Other"
          selected={hasOther}
          onClick={() => {
            if (hasOther) {
              updateData({ goals: goals.filter(g => g !== otherValue) });
            } else {
              updateData({ goals: [...goals, "Other"] });
            }
          }}
          showInput={true}
          inputValue={hasOther && otherValue !== "Other" ? otherValue : otherText}
          onInputChange={(val) => {
            setOtherText(val);
            // Replace old other with new other
            const newGoals = goals.filter(g => g === otherValue ? false : true);
            updateData({ goals: [...newGoals, val] });
          }}
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
          disabled={goals.length === 0}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
