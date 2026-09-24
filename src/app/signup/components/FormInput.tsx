import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
  required?: boolean;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  isTextarea,
  required,
}: FormInputProps) {
  const baseClasses =
    "w-full bg-[#0F1627] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/50 transition-all duration-300";

  return (
    <div className="w-full">
      <label className="block text-[15px] text-gray-200 mb-2.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}
