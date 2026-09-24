import React from "react";
import Image from "next/image";
import Link from "next/link";
import business2Img from "@/assests/business2.jpg";
import RegistrationForm from "./RegistrationForm";
import RightUpLogo from "@/components/RightUpLogo";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] flex text-gray-100">
      {/* Left Column: Image Area */}
      <div className="hidden xl:flex lg:w-[700px] relative">
        <div className="absolute inset-0 right-8">
          <Image
            src={business2Img}
            alt="Business professionals networking"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-12 lg:px-12 xl:px-16 relative">

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <RightUpLogo
              size="lg"
              className="mb-6 hover:scale-105 transition-transform"
            />
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
              Create your account
            </h1>
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00DC82] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* ── Google Sign-In ───────────────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-center">
            <GoogleSignInButton label="Continue with Google" />
          </div>
          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">
              or register with email
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Multi-step Registration Form */}
          <RegistrationForm />

        </div>
      </div>
    </div>
  );
}
