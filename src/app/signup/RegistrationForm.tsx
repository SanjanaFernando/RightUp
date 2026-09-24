"use client";

import React, { useState } from "react";
import Step1Intent from "./steps/Step1Intent";
import Step2Goals from "./steps/Step2Goals";
import Step3Business from "./steps/Step3Business";
import Step4Personal from "./steps/Step4Personal";
import Step5Contact from "./steps/Step5Contact";
import StepOtpVerify from "./steps/StepOtpVerify";
import Step6Company from "./steps/Step6Company";
import Step7Location from "./steps/Step7Location";
import Step8Socials from "./steps/Step8Socials";
import Step9Security from "./steps/Step9Security";

// Step 5.5 (OTP) is inserted between Contact and Company.
// We map display step numbers to logical steps.
const TOTAL_STEPS = 10; // 9 original + 1 OTP step

type StepKey =
  | "intent" | "goals" | "business" | "personal"
  | "contact" | "otp" | "company" | "location"
  | "socials" | "security";

const STEP_ORDER: StepKey[] = [
  "intent", "goals", "business", "personal",
  "contact", "otp", "company", "location",
  "socials", "security",
];

export default function RegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    intent: "",
    goals: [] as string[],
    stage: "",
    strengths: "",
    challenges: "",
    firstName: "",
    lastName: "",
    title: "",
    avatar: "",
    email: "",
    phone: "",
    emailVerified: false,
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    country: "",
    state: "",
    city: "",
    linkedin: "",
    twitter: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  // Load saved state on mount
  React.useEffect(() => {
    const savedStep = localStorage.getItem("rightup_signup_step");
    const savedData = localStorage.getItem("rightup_signup_data");
    if (savedStep) setStepIndex(Number(savedStep));
    if (savedData) {
      try { setFormData(JSON.parse(savedData)); } catch {}
    }
    setMounted(true);
  }, []);

  // Save state on change
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("rightup_signup_step", stepIndex.toString());
      localStorage.setItem("rightup_signup_data", JSON.stringify(formData));
    }
  }, [stepIndex, formData, mounted]);

  const handleNext = () => {
    if (stepIndex < TOTAL_STEPS - 1) setStepIndex((prev) => prev + 1);
  };
  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };
  const updateData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const currentKey = STEP_ORDER[stepIndex];
  const displayStep = stepIndex + 1; // 1-indexed for display

  const renderStep = () => {
    const props = { data: formData, updateData, onNext: handleNext, onBack: handleBack };
    switch (currentKey) {
      case "intent":    return <Step1Intent    {...props} />;
      case "goals":     return <Step2Goals     {...props} />;
      case "business":  return <Step3Business  {...props} />;
      case "personal":  return <Step4Personal  {...props} />;
      case "contact":   return <Step5Contact   {...props} />;
      case "otp":       return <StepOtpVerify  {...props} />;
      case "company":   return <Step6Company   {...props} />;
      case "location":  return <Step7Location  {...props} />;
      case "socials":   return <Step8Socials   {...props} />;
      case "security":  return <Step9Security  data={formData} updateData={updateData} onBack={handleBack} />;
      default:          return null;
    }
  };

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#00DC82] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="flex flex-col items-center mb-10">
        <p className="text-gray-400 text-sm mb-4 tracking-wide font-medium">
          Step {displayStep} of {TOTAL_STEPS}
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {STEP_ORDER.map((key, i) => (
            <div
              key={key}
              title={key === "otp" ? "Email Verification" : undefined}
              className={`transition-all duration-300 rounded-full ${
                i === stepIndex
                  ? "w-5 h-3 bg-[#00DC82] shadow-[0_0_10px_rgba(0,220,130,0.5)]"
                  : i < stepIndex
                  ? "w-3 h-3 bg-[#00DC82]/40"
                  : "w-3 h-3 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div key={currentKey} className="animate-[slideUpFade_0.4s_ease-out_forwards]">
        {renderStep()}
      </div>
    </div>
  );
}
