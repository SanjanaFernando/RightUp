import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Globe } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0F1218] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl animate-[slideUpFade_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3">
            Where are you based?
          </h2>
          <p className="text-[14px] text-gray-300 leading-relaxed max-w-sm mx-auto">
            Choose the option that best matches you. We'll send you to the correct signup page.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Australia Option */}
          <Link
            href="/signup?loc=au"
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-4 bg-[#0A0D14] border border-white/5 hover:border-white/20 hover:bg-[#141A24] rounded-2xl p-6 transition-all duration-300 group shadow-lg"
          >
            <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl relative rounded-full overflow-hidden border-2 border-white/10">
              <img 
                src="https://flagcdn.com/au.svg" 
                alt="Australia Flag" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[15px] font-semibold text-white">
              I am in Australia
            </span>
          </Link>

          {/* Outside Australia Option */}
          <Link
            href="/signup?loc=intl"
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-4 bg-[#0A0D14] border border-white/5 hover:border-white/20 hover:bg-[#141A24] rounded-2xl p-6 transition-all duration-300 group shadow-lg"
          >
            <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl rounded-full bg-[#1A2235] border-2 border-white/10 flex items-center justify-center text-[#00DC82]">
              <Globe className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <span className="text-[15px] text-center font-semibold text-white">
              I am outside Australia
            </span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[14px] text-gray-300">
            If you already have an account,{" "}
            <Link href="/login" onClick={onClose} className="text-[#00DC82] font-semibold hover:underline">
              login here
            </Link>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
