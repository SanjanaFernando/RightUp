import React from "react";

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  showInput?: boolean;
  inputValue?: string;
  onInputChange?: (val: string) => void;
}

export default function RadioOption({
  label,
  selected,
  onClick,
  showInput,
  inputValue,
  onInputChange,
}: RadioOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full rounded-xl border flex items-center p-4 cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-[#141C2A] border-[#00DC82] shadow-[0_0_15px_rgba(0,220,130,0.15)]"
          : "bg-[#0F1627] border-white/10 hover:border-white/30"
      }`}
    >
      {/* Radio Circle */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
          selected ? "border-[#00DC82]" : "border-gray-500"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#00DC82]" />}
      </div>

      {/* Label or Input */}
      {showInput && selected ? (
        <input
          type="text"
          value={inputValue || ""}
          onChange={(e) => onInputChange?.(e.target.value)}
          placeholder="Please specify"
          className="flex-1 bg-transparent border-none text-white text-[15px] focus:outline-none focus:ring-0 placeholder-gray-500"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="text-[15px] text-gray-200">{label}</span>
      )}
    </div>
  );
}
