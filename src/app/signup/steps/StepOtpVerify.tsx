"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendOtpAction, verifyOtpAction } from "@/actions/otp";
import { motion, AnimatePresence } from "framer-motion";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepOtpVerify({ data, updateData, onNext, onBack }: StepProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-send OTP as soon as this step mounts
  useEffect(() => {
    handleSend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleSend = async () => {
    setIsSending(true);
    setError(null);
    const res = await sendOtpAction(data.email);
    setIsSending(false);
    if (res.success) {
      setSent(true);
      setCountdown(60); // 60s before resend allowed
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      setError(res.error || "Failed to send code.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError(null);

    // Auto-advance
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits filled
    if (digit && next.every((d) => d !== "")) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code || otp.join("");
    if (finalCode.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    const res = await verifyOtpAction(data.email, finalCode);
    setIsVerifying(false);
    if (res.success) {
      setSuccess(true);
      updateData({ emailVerified: true });
      setTimeout(() => onNext(), 1200);
    } else {
      setError(res.error || "Invalid code.");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-sm">
          {sent ? (
            <>
              We sent a 6-digit code to{" "}
              <span className="text-[#00DC82] font-medium">{data.email}</span>
            </>
          ) : (
            "Sending verification code…"
          )}
        </p>
      </div>

      {/* OTP Input Grid */}
      <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isVerifying || success || isSending}
            animate={
              success
                ? { scale: [1, 1.15, 1], borderColor: "#00DC82" }
                : error
                ? { x: [0, -6, 6, -4, 4, 0] }
                : {}
            }
            transition={{ duration: 0.35 }}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 bg-[#0F1620] text-white outline-none transition-all duration-200 disabled:opacity-60 ${
              success
                ? "border-[#00DC82] bg-[#00DC82]/10 text-[#00DC82]"
                : error
                ? "border-red-500 bg-red-500/10"
                : digit
                ? "border-[#00DC82]/60 bg-[#00DC82]/5"
                : "border-white/20 focus:border-[#00DC82]/70"
            }`}
          />
        ))}
      </div>

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-[#00DC82] font-medium text-sm mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Email verified! Continuing…
          </motion.div>
        )}
        {isVerifying && !success && (
          <motion.p
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-400 text-sm text-center mb-4"
          >
            Verifying…
          </motion.p>
        )}
        {isSending && (
          <motion.p
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-400 text-sm text-center mb-4"
          >
            Sending code to {data.email}…
          </motion.p>
        )}
      </AnimatePresence>

      {/* Resend */}
      {sent && !success && (
        <p className="text-center text-sm text-gray-500 mb-8">
          Didn&apos;t receive it?{" "}
          <button
            onClick={handleSend}
            disabled={countdown > 0 || isSending}
            className="text-[#00DC82] hover:underline disabled:text-gray-600 disabled:no-underline transition-colors font-medium"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
        </p>
      )}

      {/* Verify Button (manual fallback) */}
      {sent && !success && (
        <button
          onClick={() => handleVerify()}
          disabled={otp.some((d) => !d) || isVerifying}
          className="w-full py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 mb-4"
        >
          {isVerifying ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            "Verify Code"
          )}
        </button>
      )}

      {/* Back */}
      <button
        onClick={onBack}
        disabled={isVerifying || success}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-transparent border border-white/20 hover:border-white/50 text-white disabled:opacity-40 mt-auto"
      >
        ← Back to Edit Email
      </button>
    </motion.div>
  );
}
