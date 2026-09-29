"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ExternalLink,
  Shield,
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import RightUpLogo from "@/components/RightUpLogo";
import { useAuthStore } from "@/store/authStore";
import { logoutUserAction } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearUser } = useAuthStore();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Blogs Management",
      href: "/admin/blogs",
      icon: FileText,
      active: pathname.startsWith("/admin/blogs"),
    },
    {
      name: "Users & Members",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
  ];

  const handleSignOut = async () => {
    await logoutUserAction();
    clearUser();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-gray-100 font-poppins flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0F1D] border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <RightUpLogo size="sm" />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00DC82] text-black">
            ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0F1D] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <RightUpLogo size="md" />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00DC82] text-black">
                ADMIN
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-[#00DC82] text-black font-bold shadow-[0_0_15px_rgba(0,220,130,0.3)]"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-black" : "text-green-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Links */}
        <div className="p-5 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-green-400 group-hover:-translate-x-0.5 transition-transform" />
              Live Website
            </span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </Link>

          <Link
            href="/blogs"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Public Blogs</span>
            <span className="text-[10px] text-green-400">View</span>
          </Link>

          {/* User Info / Logout */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                {user ? `${user.firstName?.[0] || "A"}` : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Administrator"}
                </p>
                <p className="text-[10px] text-green-400">Super Admin</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#06090F] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
