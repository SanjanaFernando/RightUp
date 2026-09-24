import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { registerUserAction } from "@/actions/auth";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onBack: () => void;
}

export default function Step9Security({ data, updateData, onBack }: StepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!data.password || data.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!data.termsAccepted) {
      setErrorMessage("You must accept the Terms of Service to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUserAction(data);
      if (response.success) {
        // Clear saved signup progress from localStorage
        localStorage.removeItem("rightup_signup_step");
        localStorage.removeItem("rightup_signup_data");
        setSuccess(true);
      } else {
        setErrorMessage(response.error || "Registration failed. Please check your details.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full animate-[slideUpFade_0.4s_ease-out_forwards] py-10">
        <div className="w-20 h-20 rounded-full bg-[#00DC82]/20 text-[#00DC82] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,220,130,0.3)]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Registration Complete!</h2>
        <p className="text-gray-300 max-w-md">
          Welcome to RightUp{data.firstName ? `, ${data.firstName}` : ""}. We're excited to help you grow your business and build powerful connections.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-10 px-8 py-3.5 rounded-xl font-bold text-[16px] transition-all duration-300 bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Security & Finalization
        </h2>
        <p className="text-gray-400 text-sm">Secure your account to finish registration.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-6 mb-10 flex-1">
        <FormInput
          label="Password"
          type="password"
          value={data.password || ""}
          onChange={(val) => updateData({ password: val })}
          placeholder="Create a strong password (min 6 characters)"
          required
        />
        <FormInput
          label="Confirm Password"
          type="password"
          value={data.confirmPassword || ""}
          onChange={(val) => updateData({ confirmPassword: val })}
          placeholder="Confirm your password"
          required
        />

        <div className="flex items-start gap-3 mt-4">
          <button
            type="button"
            onClick={() => updateData({ termsAccepted: !data.termsAccepted })}
            className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors mt-0.5 ${
              data.termsAccepted ? "bg-[#00DC82] border-[#00DC82]" : "border-gray-500"
            }`}
          >
            {data.termsAccepted && (
              <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <p className="text-sm text-gray-300">
            I agree to the <a href="#" className="text-[#00DC82] hover:underline">Terms of Service</a> and <a href="#" className="text-[#00DC82] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div className="mt-auto flex gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-1/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 bg-transparent border border-white/20 hover:border-white/50 text-white disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!data.password || data.password !== data.confirmPassword || !data.termsAccepted || isSubmitting}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </div>
  );
}
