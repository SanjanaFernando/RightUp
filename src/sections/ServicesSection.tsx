"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ourServicesImg from "@/assests/ourservices.png";

const SERVICES_LIST = [
  {
    id: "01",
    title: "Strategic Connections",
    description:
      "We connect you with trusted customers, partners, suppliers, and investors aligned with your goals to drive mutual growth.",
  },
  {
    id: "02",
    title: "Visibility & Recognition",
    description:
      "We amplify your brand, showcase your achievements, and build your credibility locally and across international markets.",
  },
  {
    id: "03",
    title: "Business Strategy & Support",
    description:
      "We refine your positioning and messaging to help you scale your business operations with clarity and confidence.",
  },
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="services" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0c1938] via-[#091124] to-[#070b14] border border-blue-500/20 p-6 sm:p-10 lg:p-12 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Vertical Badge */}
          <div className="hidden xl:flex absolute left-[-20px] top-12 z-30 items-center justify-center">
            <div className="bg-green-500 text-xs uppercase tracking-widest py-3 px-2 rounded-r-lg shadow-lg [writing-mode:vertical-rl] rotate-180">
              WHAT WE DO
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column - Service Intro & List */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <Image
                    src={ourServicesImg}
                    alt="Our Services"
                    className="h-12 sm:h-16 lg:h-[72px] w-auto object-contain"
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-4">
                  Take your business to the next level with RightUp get noticed, build powerful connections, and unlock global opportunities.
                </p>
              </div>

              {/* Numbered Service Items */}
              <div className="space-y-3">
                {SERVICES_LIST.map((service, idx) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left rounded-2xl px-5 py-4 border transition-all duration-300 flex items-center gap-4 ${activeTab === idx
                      ? "bg-[#152342] border-blue-400/60 shadow-lg shadow-blue-500/10"
                      : "bg-[#0B1323]/60 border-white/10 hover:border-white/20 hover:bg-[#0F1A30]"
                      }`}
                  >
                    <span
                      className={`text-base font-bold transition-colors ${activeTab === idx ? "text-green-500" : "text-green-500/80"
                        }`}
                    >
                      {service.id}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {service.title}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 text-green-500 hover:text-green-300 font-semibold text-sm sm:text-base group transition-colors"
                >
                  <span>See More Services</span>
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Center Column - Showcase Image */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-w-sm rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"
                  alt="Business collaboration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B12]/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* Right Column - Action Cards */}
            <div className="lg:col-span-3 flex flex-col gap-5 justify-center">
              {/* Dark Support Card */}
              <div className="rounded-3xl bg-[#090F1C]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Need help? We&apos;re here to{" "}
                  <span className="text-green-500 font-semibold">support 24/7</span>{" "}
                  with guidance, updates, and quick answers whenever you need them
                </p>
                <Link
                  href="#signup"
                  className="flex items-center justify-between group pt-2"
                >
                  <span className="text-base font-bold text-white group-hover:text-green-500 transition-colors">
                    Register Now
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500 transition-all shadow-md">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>

              {/* Vibrant green Action Card */}
              <div className="rounded-3xl bg-green-500 p-6 text-gray-950 flex flex-col justify-between shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300">
                <p className="text-xs text-green-950 font-medium leading-relaxed mb-6">
                  We also provide on-demand professional services strategic support to help your business grow with confidence.
                </p>
                <Link
                  href="#services"
                  className="flex items-center justify-between group pt-2"
                >
                  <span className="text-base font-bold text-gray-950 group-hover:text-black transition-colors">
                    On-Demand Business Services
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-all shadow-md flex-shrink-0 ml-2">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
