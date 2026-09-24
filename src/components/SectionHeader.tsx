import React from "react";

interface SectionHeaderProps {
  watermarkText?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  watermarkText,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Background Watermark */}
      {watermarkText && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 watermark-text select-none text-center whitespace-nowrap">
          {watermarkText}
        </div>
      )}

      {/* Section Header */}
      <div className={`relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 ${watermarkText ? 'pt-[75px]' : ''}`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base sm:text-lg text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
