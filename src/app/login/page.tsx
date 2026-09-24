"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signupImg from "@/assests/signup.png";
import RightUpLogo from "@/components/RightUpLogo";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { loginUserAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await loginUserAction({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (response.success) {
        setSuccessMessage(`Welcome back${response.data?.name ? `, ${response.data.name}` : ""}! Redirecting...`);
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(response.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex text-gray-100 font-poppins">
      {/* Left Column: Image Area */}
      <div className="hidden xl:flex lg:w-[45%] relative">
        <div className="absolute inset-0 pt-8 right-8">
          {/* Gradient Border Background */}
          <div className="absolute inset-0 right-0 rounded-tr-[80px] bg-gradient-to-br from-[#00DC82] via-[#1D4ED8] to-[#00DC82] bg-[length:200%_200%] animate-moving-gradient" />

          {/* Image Container */}
          <div className="absolute top-2 left-0 right-2 bottom-0 rounded-tr-[76px] overflow-hidden bg-black">
            <Image
              src={signupImg}
              alt="Login"
              fill
              className="object-cover opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex-1 flex flex-col justify-center min-h-screen overflow-y-auto">
        <div className="w-full max-w-md mx-auto px-6 py-12 relative animate-[slideUpFade_0.4s_ease-out]">

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <RightUpLogo
              size="lg"
              className="mb-8 hover:scale-105 transition-transform"
            />
            <h1 className="text-2xl font-bold text-white tracking-tight">Log in</h1>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 text-[#00DC82] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Username / Email */}
            <div>
              <label className="block text-[15px] text-gray-200 mb-2.5 font-medium">
                Username or Email Address
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1A1F29] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/50 transition-all duration-300"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[15px] text-gray-200 mb-2.5 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#1A1F29] border border-white/5 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/50 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, rememberMe: !formData.rememberMe })}
                className={`w-5 h-5 flex-shrink-0 flex items-center justify-center border transition-all rounded ${formData.rememberMe
                    ? "bg-[#0F1115] border-gray-400"
                    : "bg-transparent border-gray-500"
                  }`}
              >
                {formData.rememberMe && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-[15px] text-gray-300 cursor-pointer select-none" onClick={() => setFormData({ ...formData, rememberMe: !formData.rememberMe })}>
                Remember Me
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-[16px] transition-all duration-300 bg-[#008F55] hover:bg-[#00A662] text-white shadow-lg shadow-green-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Log in"
                )}
              </button>
            </div>

          </form>

          {/* Footer Links */}
          <div className="mt-10 flex flex-col space-y-8">
            <Link href="#forgot-password" className="text-[14px] text-gray-300 hover:text-white underline underline-offset-4 decoration-white/30 transition-colors inline-block w-fit">
              Lost Password?
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-[14px] text-gray-300">Don't have an account?</span>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-full border border-white/20 text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Signup
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
