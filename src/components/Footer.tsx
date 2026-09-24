"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Phone, Mail, CheckCircle2 } from "lucide-react";
import RightUpLogo from "./RightUpLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <footer id="contact" className="w-full bg-slate-900 border-t border-white/10 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <RightUpLogo size="md" />
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              RightUp helps businesses grow through meaningful connections, trusted partnerships, and global opportunities.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-5 tracking-wide">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#about" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> About Us
                </Link>
              </li>
              <li>
                <Link href="#memberships" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Membership
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Services
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link href="#signup" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Register
                </Link>
              </li>
              <li>
                <Link href="#login" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-5 tracking-wide">Useful Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#blogs" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Blogs & News
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> E Magazines
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Terms of Services
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-green-500 transition-colors flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">›</span> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-white mb-2 tracking-wide">Newsletter</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Sign up and receive the latest tips via email.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-[#0F1627] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-bold text-sm text-black bg-[#00DC82] hover:bg-[#00c574] transition-all shadow-md shadow-green-500/20"
              >
                {subscribed ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Subscribed!
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>

            <div className="pt-2 space-y-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="tel:+61412886171" className="hover:text-white transition-colors">
                  +61 412 886 171
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="mailto:info@rightup.com.au" className="hover:text-white transition-colors">
                  info@rightup.com.au
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Copyright & Payment Badges */}
      <div className="w-full border-t border-white/10 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 built by W3ICON</p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            {/* Amex */}
            <div className="h-6 px-2.5 rounded bg-[#006FCF] text-[10px] font-black italic text-white flex items-center justify-center">
              AMEX
            </div>
            {/* Discover */}
            <div className="h-6 px-2.5 rounded bg-[#FF6000] text-[10px] font-bold text-white flex items-center justify-center">
              DISCOVER
            </div>
            {/* Mastercard */}
            <div className="h-6 px-2 rounded bg-[#252525] flex items-center justify-center gap-0.5">
              <span className="w-3 h-3 rounded-full bg-[#EB001B] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1.5 inline-block opacity-90" />
            </div>
            {/* PayPal */}
            <div className="h-6 px-2.5 rounded bg-[#003087] text-[10px] font-bold italic text-white flex items-center justify-center">
              PayPal
            </div>
            {/* Visa */}
            <div className="h-6 px-2.5 rounded bg-[#1A1F71] text-[10px] font-extrabold italic text-white flex items-center justify-center">
              VISA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
