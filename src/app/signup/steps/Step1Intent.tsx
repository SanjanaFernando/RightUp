import React, { useState } from "react";
import RadioOption from "../components/RadioOption";

interface Step1Props {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
}

const OPTIONS = [
  "To grow my business",
  "To find investors or funding",
  "To offer my professional services",
  "To discover new partnerships",
  "To expand into global markets",
  "To build my personal brand",
];

export default function Step1Intent({ data, updateData, onNext }: Step1Props) {
  const [otherText, setOtherText] = useState("");
  
  const isOtherSelected = data.intent && !OPTIONS.includes(data.intent);

  const handleSelect = (val: string) => {
    updateData({ intent: val });
  };

  const handleNext = () => {
    if (data.intent) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          1. How are you joining? <span className="text-red-500 font-normal text-sm ml-2">(Required)</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3 mb-10 flex-1">
        {OPTIONS.map((opt) => (
          <RadioOption
            key={opt}
            label={opt}
            selected={data.intent === opt}
            onClick={() => handleSelect(opt)}
          />
        ))}
        
        {/* Other Option */}
        <RadioOption
          label="Other"
          selected={isOtherSelected || data.intent === "Other"}
          onClick={() => {
            if (!isOtherSelected) {
              updateData({ intent: "Other" });
            }
          }}
          showInput={true}
          inputValue={isOtherSelected ? data.intent : otherText}
          onInputChange={(val) => {
            setOtherText(val);
            updateData({ intent: val });
          }}
        />
      </div>

      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={!data.intent || data.intent === "Other"}
          className="w-full py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
