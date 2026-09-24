"use client";

import React from "react";
import Image from "next/image";
import { Users, Megaphone, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ellipseBg from "@/assests/ellipse.png";
import { ScrollReveal, fadeLeft, fadeRight, staggerContainer, staggerChild } from "@/lib/motion";

const FEATURES = [
  {
    icon: Users,
    title: "Strategic Connections",
    description:
      "We connect you with trusted customers, partners, suppliers, and investors aligned with your goals.",
  },
  {
    icon: Megaphone,
    title: "Visibility & Recognition",
    description:
      "We amplify your brand, showcase your achievements, and build your credibility locally and globally.",
  },
  {
    icon: BarChart3,
    title: "Business Strategy & Support",
    description:
      "We refine your positioning and messaging to help you grow with clarity and confidence.",
  },
  {
    icon: TrendingUp,
    title: "Growth Pathways",
    description:
      "Access curated funding, certifications, trade opportunities, and workshops designed to accelerate your growth.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-[#0A101D] border border-white/10 shadow-2xl">
          {/* Spinning Ellipse Background */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-0 pointer-events-none">
            <div className="absolute -inset-[50%] opacity-50 flex items-center justify-center animate-[spin_30s_linear_infinite]">
              <Image src={ellipseBg} alt="Glow background" fill className="object-contain" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Timeline */}
            <ScrollReveal variants={fadeLeft} className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-14 lg:pr-8">
              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase mb-3"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                WHY CHOOSE RIGHTUP?
              </motion.h2>
              <motion.p
                className="text-sm sm:text-base text-gray-300 mb-10 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                RightUp empowers ambitious businesses to connect, gain visibility, and unlock real growth.
              </motion.p>

              {/* Timeline Items */}
              <motion.div
                className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-green-500/30"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {FEATURES.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={staggerChild}
                      className="relative flex items-start gap-4 sm:gap-6 group"
                    >
                      {/* Timeline dot */}
                      <motion.div
                        className="absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-600 text-black flex items-center justify-center ring-4 ring-[#0A101D] shadow-[0_0_12px_rgba(0,220,130,0.5)]"
                        whileHover={{ scale: 1.25 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      </motion.div>

                      <div className="pl-3 sm:pl-2">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-green-500 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </ScrollReveal>

            {/* Right Column: Image */}
            <ScrollReveal
              variants={fadeRight}
              className="lg:col-span-5 relative flex justify-end mt-10 lg:mt-0 p-6 sm:p-10 lg:p-0 lg:ml-8"
            >
              <motion.div
                className="relative w-full aspect-[4/5] lg:aspect-auto h-full rounded-[2rem] lg:rounded-none overflow-hidden border-y border-l border-white/10 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt="Business leader with mobile phone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D]/70 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Experience Badge */}
              <motion.div
                className="absolute mt-[-40px] ml-[240px] translate-y-1/2 translate-x-1/2 bg-blue-900 text-white px-5 py-3 shadow-xl flex items-center gap-2 z-10 lg:top-6 lg:right-auto lg:left-0 lg:-translate-x-1/2 lg:-translate-y-0"
                initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
                whileHover={{ scale: 1.06, rotate: 2 }}
              >
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">5+</span>
                <div className="text-xs font-semibold leading-tight uppercase tracking-wider text-blue-100">
                  Years of
                  <br />
                  Experience
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
