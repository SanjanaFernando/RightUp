"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: (string | CustomSelectOption)[];
  onChange: (value: string) => void;
  required?: boolean;
}

export default function CustomSelect({
  label,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const formattedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = formattedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[15px] text-gray-200 mb-2.5 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-[#0F1627] border rounded-xl px-4 py-3.5 text-left flex items-center justify-between transition-all duration-300 focus:outline-none ${
            isOpen
              ? "border-[#00DC82] ring-1 ring-[#00DC82]/50 shadow-[0_0_15px_rgba(0,220,130,0.15)]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <span
            className={`text-[15px] truncate select-none ${
              selectedOption ? "text-white" : "text-gray-400"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
              isOpen ? "rotate-180 text-[#00DC82]" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0F1627] border border-white/10 shadow-2xl p-1.5 z-50 backdrop-blur-xl max-h-60 overflow-y-auto animate-[slideUpFade_0.2s_ease-out]">
            {formattedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-left text-[14px] flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-[#00DC82]/15 text-[#00DC82] font-medium"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#00DC82] flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
