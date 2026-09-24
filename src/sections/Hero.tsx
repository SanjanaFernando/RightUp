"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Facebook, Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";

import blurredRectImg from "@/assests/blured_rectangle.png";
import { fadeUp, staggerContainer, staggerChild } from "@/lib/motion";


export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex pt-[296px] pl-[80px] overflow-hidden">
      {/* Background Video — fade in */}
      <motion.div
        className="absolute top-[92px] inset-0 z-0 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <video
          src="/herovideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Blurred Rectangle Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={blurredRectImg}
          alt="Blurred Overlay"
          fill
          className="object-cover opacity-100"
        />
      </div>

      {/* Floating Right Social Links — slide in from right with stagger */}
      <motion.div
        className="hidden lg:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            href: "https://facebook.com",
            label: "Facebook",
            icon: <Facebook className="w-5 h-5 fill-current" />,
            color: "#1877F2",
          },
          {
            href: "https://linkedin.com",
            label: "LinkedIn",
            icon: <Linkedin className="w-5 h-5 fill-current" />,
            color: "#0A66C2",
          },
          {
            href: "https://instagram.com",
            label: "Instagram",
            icon: <Instagram className="w-5 h-5" />,
            color: "#E4405F",
          },
        ].map((social) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            variants={staggerChild}
            whileHover={{ scale: 1.15, rotate: 6 }}
            style={{
              background: `${social.color}20`,
              border: `1px solid ${social.color}40`,
              color: social.color,
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-0 px-4 sm:px-0 lg:px-0 text-left sm:text-left w-full">
        <div className="max-w-3xl">
          {/* Heading — lines stagger in */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-[48px] font-semibold tracking-tight text-white leading-[1.1] mb-6 flex flex-col gap-1 sm:gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUp} custom={0}>
              Find the{" "}
              <motion.span
                className="inline-block text-blue-900 font-light italic drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-default"
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Right
              </motion.span>{" "}
              People
            </motion.span>
            <motion.span variants={fadeUp} custom={0.15}>
              Unlock{" "}
              <motion.span
                className="inline-block text-green-500 font-light italic drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-default"
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Real
              </motion.span>{" "}
              Opportunities
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base sm:text-[20px] md:text-[24px] text-gray-300 mb-[40px] max-w-2xl leading-relaxed font-light"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
          >
            We connect professionals and business with the right network,
            opportunities and markets to grow with confidence
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerChild} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-blue-900 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:gap-3 transition-all duration-300"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={staggerChild} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#memberships"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-gray-200 hover:text-white hover:gap-3"
              >
                <span>View Memberships</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
