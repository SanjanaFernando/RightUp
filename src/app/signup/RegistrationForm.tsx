"use client";

import React, { useState } from "react";
import Step1Intent from "./steps/Step1Intent";
import Step2Goals from "./steps/Step2Goals";
import Step3Business from "./steps/Step3Business";
import Step4Personal from "./steps/Step4Personal";
import Step5Contact from "./steps/Step5Contact";
import Step6Company from "./steps/Step6Company";
import Step7Location from "./steps/Step7Location";
import Step8Socials from "./steps/Step8Socials";
import Step9Security from "./steps/Step9Security";

const TOTAL_STEPS = 9;

export default function RegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    intent: "",
    goals: [] as string[],
    stage: "",
    strengths: "",
    challenges: "",
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
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
    
    if (savedStep) setCurrentStep(Number(savedStep));
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved signup data");
      }
    }
    setMounted(true);
  }, []);

  // Save state on change
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("rightup_signup_step", currentStep.toString());
      localStorage.setItem("rightup_signup_data", JSON.stringify(formData));
    }
  }, [currentStep, formData, mounted]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Intent data={formData} updateData={updateData} onNext={handleNext} />;
      case 2:
        return <Step2Goals data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3Business data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4Personal data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5Contact data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Step6Company data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <Step7Location data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <Step8Socials data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 9:
        return <Step9Security data={formData} updateData={updateData} onBack={handleBack} />;
      default:
        return null;
    }
  };

  // Prevent hydration mismatch and UI flashing
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
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <div className="flex items-center gap-3">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i + 1 === currentStep
                  ? "bg-[#00DC82] shadow-[0_0_10px_rgba(0,220,130,0.5)]" // Active
                  : i + 1 < currentStep
                  ? "bg-[#00DC82]/40" // Completed
                  : "bg-gray-600" // Upcoming
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="animate-[slideUpFade_0.4s_ease-out_forwards]">
        {renderStep()}
      </div>
    </div>
  );
}
