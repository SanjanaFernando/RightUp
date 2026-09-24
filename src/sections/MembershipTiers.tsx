import React from "react";
import Link from "next/link";
import { Award, Gem, ShieldCheck, ArrowRight } from "lucide-react";

import SectionHeader from "@/components/SectionHeader";

const TIERS = [
  {
    name: "ACCESS Membership",
    icon: Award,
    description:
      "Build your foundation with profile setup, insights, alerts, and curated introductions to start connecting and growing.",
    featured: false,
  },
  {
    name: "PRIME ACCESS Membership",
    icon: Gem,
    description:
      "Unlock premium growth support with high-intent introductions, direct email support, magazine features, and expansion pathways including funding and export opportunities.",
    featured: true,
  },
  {
    name: "ACCESS PLUS Membership",
    icon: ShieldCheck,
    description:
      "Boost your visibility and growth with priority review, wider network exposure, and specialist workshops.",
    featured: false,
  },
];

export default function MembershipTiers() {
  return (
    <section id="memberships" className="relative py-24 overflow-hidden">
      <SectionHeader
        watermarkText="MEMBERSHIPS"
        title="Right Up Access Tiers"
        subtitle="Exclusive membership tiers built to elevate your network and expand your opportunities."
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className={`group rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between transition-all duration-500 ease-out relative ${tier.featured
                  ? "bg-gradient-to-b from-[#0b2b25] via-[#071916] to-[#061210] border-2 border-green-500 shadow-[0_0_50px_-10px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] scale-105 hover:scale-[1.08] lg:-translate-y-2 lg:hover:-translate-y-4 z-20"
                  : "bg-[#0B1323]/70 border border-white/10 hover:border-white/25 hover:bg-[#0E182D] backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-10"
                  }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Icon Circle */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${tier.featured
                      ? "bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 text-white border border-white/10"
                      }`}
                  >
                    <Icon className="w-8 h-8 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-6 text-center lg:text-left">
                    {tier.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-300 leading-relaxed text-center lg:text-left">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-10">
                  <Link
                    href="#signup"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 ${tier.featured
                      ? "bg-green-500 text-black hover:bg-green-300 shadow-lg shadow-green-500/30"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
