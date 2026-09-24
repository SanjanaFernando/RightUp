"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import RightUpLogo from "./RightUpLogo";
import SignupModal from "./SignupModal";
import UserDropdown from "./UserDropdown";
import ProfileModal from "./ProfileModal";
import { getCurrentUserAction, logoutUserAction } from "@/actions/auth";
import { useAuthStore } from "@/store/authStore";

/**
 * Reads the JWT cookie payload without a network request.
 * Used only as an optimistic fallback on hard refresh before
 * the sessionStorage store has hydrated.
 */
function getOptimisticUserFromCookie(): { firstName: string; lastName: string } | null {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("rightup_session="));
    if (!cookie) return null;
    const token = cookie.split("=")[1];
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.name) return null;
    const parts = (payload.name as string).split(" ");
    return { firstName: parts[0] || "", lastName: parts[1] || "" };
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // ── Global auth store (Zustand) ──────────────────────────────────────────
  const { user: currentUser, isLoaded, setUser, updateUser, clearUser, setLoaded } = useAuthStore();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close resources dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check auth state on mount
  useEffect(() => {
    // If the Zustand store already has a user (from sessionStorage on client-side
    // navigation or a previous hard refresh), we can skip the DB call entirely.
    if (currentUser) {
      setLoaded(true);
      return;
    }

    // Fallback: show initials instantly from the JWT cookie while DB loads.
    const optimistic = getOptimisticUserFromCookie();
    if (optimistic) {
      setUser(optimistic as any);
    }

    // Fetch the full user profile from DB in the background.
    async function loadUser() {
      try {
        const res = await getCurrentUserAction();
        if (res.success && res.data) {
          setUser(res.data); // persist to store + sessionStorage
        } else {
          clearUser(); // session expired or invalid
        }
      } catch (err) {
        console.error("Failed to fetch user session", err);
        clearUser();
      } finally {
        setLoaded(true);
      }
    }
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${scrolled
        ? "bg-[#070B12]/30 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/20"
        : "bg-background py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <RightUpLogo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-9">
          <Link
            href="#about"
            className="text-[20px] font-normal text-gray-200 hover:text-white transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="#memberships"
            className="text-[20px] font-normal text-gray-200 hover:text-white transition-colors duration-200"
          >
            Membership
          </Link>

          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button
              onClick={() => setResourcesOpen((prev) => !prev)}
              type="button"
              className="flex items-center gap-1 text-[20px] font-normal text-gray-200 hover:text-white transition-colors duration-200 py-1"
            >
              <span>Resources</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
            </button>
            {resourcesOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl animate-[slideUpFade_0.2s_ease-out]"
              >
                <Link
                  href="#blogs"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-4 py-2.5 text-base font-normal text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Blogs & News
                </Link>
                <Link
                  href="#services"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-4 py-2.5 text-base font-normal text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  E-Magazines
                </Link>
                <Link
                  href="#why-choose-us"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-4 py-2.5 text-base font-normal text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Case Studies
                </Link>
              </div>
            )}
          </div>

          <Link
            href="#services"
            className="text-[20px] font-normal text-gray-200 hover:text-white transition-colors duration-200"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="text-[20px] font-normal text-gray-200 hover:text-white transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* CTA: User Pill when logged in, or Signup button when logged out */}
        <div className="hidden md:flex items-center">
          {currentUser ? (
            <UserDropdown
              user={currentUser}
              onOpenProfile={() => setProfileModalOpen(true)}
              onSignOut={async () => {
                await logoutUserAction();
                clearUser();
                window.location.href = "/";
              }}
            />
          ) : !isLoaded ? (
            // Skeleton — prevents flash of Signup button while session is confirmed
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          ) : (
            <button
              onClick={() => setSignupModalOpen(true)}
              className="px-7 py-2.5 rounded-full text-[20px] font-normal text-white bg-gray-800 glow-border-green hover:border-green-500 hover:bg-[#1C263D] hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300"
            >
              Signup
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0F1D]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3 font-poppins">
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-[20px] font-normal text-gray-200 hover:text-white hover:bg-white/5"
          >
            About
          </Link>
          <Link
            href="#memberships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-[20px] font-normal text-gray-200 hover:text-white hover:bg-white/5"
          >
            Membership
          </Link>
          <Link
            href="#blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-[20px] font-normal text-gray-200 hover:text-white hover:bg-white/5"
          >
            Resources
          </Link>
          <Link
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-[20px] font-normal text-gray-200 hover:text-white hover:bg-white/5"
          >
            Services
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-[20px] font-normal text-gray-200 hover:text-white hover:bg-white/5"
          >
            Contact
          </Link>
          <div className="pt-2">
            {currentUser ? (
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-2xl">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-[#0E131F] flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        `${(currentUser.firstName || "U")[0]}${(currentUser.lastName || "")[0] || ""}`.toUpperCase()
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{`${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()}</div>
                    <div className="text-gray-400 text-xs">{currentUser.email}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logoutUserAction();
                      clearUser();
                      window.location.href = "/";
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSignupModalOpen(true);
                }}
                className="block w-full text-center px-6 py-3 rounded-full text-[20px] font-normal text-white bg-green-600 hover:bg-green-500 transition-colors"
              >
                Signup
              </button>
            )}
          </div>
        </div>
      )}

      {/* Signup Modal */}
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)} 
      />

      {/* Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={currentUser}
          onProfileUpdated={(updated) => updateUser(updated)}
        />
      )}
    </header>
  );
}
