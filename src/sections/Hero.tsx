import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Facebook, Linkedin, Instagram } from "lucide-react";

import blurredRectImg from "@/assests/blured_rectangle.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex pt-[296px] pl-[80px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute top-[92px] inset-0 z-0 pointer-events-none select-none">
        <video
          src="/herovideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        />
      </div>

      {/* Blurred Rectangle Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={blurredRectImg}
          alt="Blurred Overlay"
          fill
          className="object-cover opacity-100"
        />
      </div>


      {/* Floating Right Social Links */}
      <div className="hidden lg:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5 fill-current" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5 fill-current" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#E4405F]/20 border border-[#E4405F]/40 text-[#E4405F] flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-0 px-4 sm:px-0 lg:px-0 text-left sm:text-left w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-[48px] font-semibold tracking-tight text-white leading-[1.1] mb-6 flex flex-col gap-1 sm:gap-2">
            <span className="opacity-0 animate-[slideUpFade_0.8s_ease-out_forwards]">
              Find the <span className="inline-block text-blue-900 font-light italic drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 hover:-rotate-2 transition-transform duration-300 cursor-default">Right</span> People
            </span>
            <span className="opacity-0 animate-[slideUpFade_0.8s_ease-out_0.2s_forwards]">
              Unlock <span className="inline-block text-green-500 font-light italic drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 hover:rotate-2 transition-transform duration-300 cursor-default">Real</span> Opportunities
            </span>
          </h1>

          <p className="text-base sm:text-[20px] md:text-[24px] text-gray-300 mb-[40px] max-w-2xl leading-relaxed font-light">
            We connect professionals and business with the right network, opportunities and markets to grow with confidence
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-blue-900 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:gap-3 transition-all duration-300"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#memberships"
              className="inline-flex items-center gap-2 px-7 py-3.5  text-base font-medium text-gray-200  hover:text-white hover:border-white/30 hover:gap-3 "
            >
              <span>View Memberships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
