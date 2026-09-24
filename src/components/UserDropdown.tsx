"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { logoutUserAction } from "@/actions/auth";

export interface UserMenuProps {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    avatarUrl?: string;
  };
  onSignOut?: () => void;
  onOpenProfile?: () => void;
}

export default function UserDropdown({ user, onSignOut, onOpenProfile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const initials = `${(user.firstName || "U")[0]}${(user.lastName || "")[0] || ""}`.toUpperCase();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await logoutUserAction();
    if (onSignOut) {
      onSignOut();
    } else {
      window.location.href = "/";
    }
  };

  const handleOpenProfile = () => {
    setIsOpen(false);
    onOpenProfile?.();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-[#111622]/80 border border-[#00DC82]/40 hover:border-[#00DC82] hover:bg-[#182030] transition-all duration-300 shadow-md focus:outline-none"
        aria-expanded={isOpen}
      >
        {/* Avatar Circle */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] p-[1.5px] flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full rounded-full bg-[#0E131F] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-300 transition-transform duration-200 mr-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-[22px] bg-[#14231E]/95 border border-[#1F3E33] shadow-2xl p-4 z-50 backdrop-blur-xl animate-[slideUpFade_0.2s_ease-out]">
          {/* Header: User Profile Brief */}
          <div className="flex items-center gap-3 pb-4 mb-3 border-b border-white/5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] p-[1.5px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-[#0E131F] flex items-center justify-center font-bold text-sm text-white overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-base font-medium truncate">{fullName}</span>
              <span className="text-gray-400 text-xs truncate">{user.email}</span>
            </div>
          </div>

          {/* Group 1: Profile & Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 mb-2.5 space-y-0.5">
            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-[14px] transition-colors text-left"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>User Profile</span>
            </button>
            <Link
              href="#settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-[14px] transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Group 2: Billing & Help Center */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 mb-3 space-y-0.5">
            <Link
              href="#billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-[14px] transition-colors"
            >
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span>Billing</span>
            </Link>
            <Link
              href="#help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-[14px] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Help Center</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#008F55] hover:bg-[#00A662] text-white font-medium text-[14px] transition-all duration-200 shadow-md shadow-green-900/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
