import React from "react";
import Image from "next/image";
import Link from "next/link";
import signupImg from "@/assests/signup.png";
import RegistrationForm from "./RegistrationForm";
import RightUpLogo from "@/components/RightUpLogo";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] flex text-gray-100">
      {/* Left Column: Image Area */}
      <div className="hidden xl:flex lg:w-[700px] relative">
        <div className="absolute inset-0 right-8">
          <Image
            src={signupImg}
            alt="Business professionals networking"
            fill
            className="object-fill"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-12 lg:px-12 xl:px-16 relative">

          {/* Logo & Header Container */}
          <div className="flex flex-col items-center text-center mb-8">
            <RightUpLogo
              size="lg"
              className="mb-6 hover:scale-105 transition-transform"
            />

            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Signup</h1>
          </div>

          {/* Dynamic Registration Form */}
          <RegistrationForm />

        </div>
      </div>
    </div>
  );
}
