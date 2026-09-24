"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Camera, Building2, MapPin, Globe, Phone, Mail, User, Save, CheckCircle2 } from "lucide-react";
import { updateProfileAction } from "@/actions/auth";
import { useAuthStore } from "@/store/authStore";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated?: (updatedUser: any) => void;
}

export default function ProfileModal({ isOpen, onClose, user, onProfileUpdated }: ProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "business" | "location">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Write directly to global store — Navbar avatar updates instantly
  const { updateUser: updateStoreUser } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    phone: "",
    avatar: "",
    companyName: "",
    industry: "",
    website: "",
    country: "",
    state: "",
    city: "",
    linkedin: "",
    twitter: "",
    stage: "",
    strengths: "",
    challenges: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Populate state when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        title: user.title || "",
        phone: user.phone || "",
        avatar: user.avatarUrl || user.avatar || "",
        companyName: user.companyName || "",
        industry: user.industry || "",
        website: user.website || "",
        country: user.country || "",
        state: user.state || "",
        city: user.city || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
        stage: user.stage || "",
        strengths: user.strengths || "",
        challenges: user.challenges || "",
      });
    }
  }, [user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        // Compress: max 256x256, JPEG at 0.75 quality — keeps avatars tiny (~15-30KB)
        const MAX = 256;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setFormData((prev) => ({ ...prev, avatar: compressed }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const updated = { ...user, ...formData, avatarUrl: formData.avatar };

    // ── Optimistic update ────────────────────────────────────────────────────
    // Update UI and store IMMEDIATELY so the user sees the change right away.
    updateStoreUser(updated);
    if (onProfileUpdated) onProfileUpdated(updated);
    setSuccessMessage("Profile updated!");
    setTimeout(() => setSuccessMessage(null), 3000);

    // ── Background sync ──────────────────────────────────────────────────────
    // Save to server silently. Revert only if there's an actual failure.
    setIsSaving(true);
    try {
      const res = await updateProfileAction(formData);
      if (!res.success) {
        // Revert store to old user data on failure
        updateStoreUser(user);
        if (onProfileUpdated) onProfileUpdated(user);
        setSuccessMessage(null);
        setErrorMessage(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      updateStoreUser(user);
      if (onProfileUpdated) onProfileUpdated(user);
      setSuccessMessage(null);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };


  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "User Profile";
  const initials = `${(formData.firstName || "U")[0]}${(formData.lastName || "")[0] || ""}`.toUpperCase();

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[slideUpFade_0.3s_ease-out]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 flex items-center justify-center text-[#00DC82]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Profile</h2>
              <p className="text-xs text-gray-400">Manage your personal and business details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 text-[#00DC82] text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Profile Card Header Banner */}
        <div className="px-6 sm:px-8 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#141C2A]/60 border border-white/5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0E131F] flex items-center justify-center overflow-hidden font-bold text-lg text-white">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                title="Change Photo"
              >
                <Camera className="w-5 h-5 text-[#00DC82]" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{fullName}</h3>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              {formData.title && <p className="text-xs text-[#00DC82] mt-0.5">{formData.title}</p>}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              Upload Photo
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 sm:px-8 mt-4 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === "general" ? "text-[#00DC82]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            General
            {activeTab === "general" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00DC82] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("business")}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === "business" ? "text-[#00DC82]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Business & Org
            {activeTab === "business" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00DC82] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === "location" ? "text-[#00DC82]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Location & Socials
            {activeTab === "location" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00DC82] rounded-full" />
            )}
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
          {activeTab === "general" && (
            <div className="space-y-4 animate-[slideUpFade_0.2s_ease-out]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Managing Director, Founder"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+61 400 000 000"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-[#141822] border border-white/5 rounded-xl px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">Email cannot be changed directly.</span>
              </div>
            </div>
          )}

          {activeTab === "business" && (
            <div className="space-y-4 animate-[slideUpFade_0.2s_ease-out]">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Company / Organization</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="RightUp Pty Ltd"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Technology, Consulting"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Key Strengths</label>
                <textarea
                  rows={2}
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="Your main business strengths"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="space-y-4 animate-[slideUpFade_0.2s_ease-out]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Australia"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NSW"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Sydney"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Twitter / X Profile</label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="https://x.com/username"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00DC82]"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-transparent border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
