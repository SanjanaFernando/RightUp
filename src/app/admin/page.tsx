"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Eye,
  MessageSquare,
  Shield,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getAdminStatsAction, AdminStats } from "@/actions/admin";
import { getAllBlogsAction, BlogType } from "@/actions/blogs";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [statsRes, blogsRes] = await Promise.all([
      getAdminStatsAction(),
      getAllBlogsAction({ includeUnpublished: true }),
    ]);

    if (statsRes.success && statsRes.stats) {
      setStats(statsRes.stats);
    }
    if (blogsRes.success && blogsRes.blogs) {
      setRecentBlogs(blogsRes.blogs.slice(0, 5));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RightUp Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Monitor registered members, manage database-backed blogs, and oversee platform activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/blogs?create=true"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Blog Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-32 rounded-3xl bg-[#0B1323]/80 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Users */}
          <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-green-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Members
              </span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold text-white">
                {stats?.totalUsers ?? 0}
              </h2>
              <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                <span>{stats?.totalAdmins ?? 0} Admin accounts</span>
              </p>
            </div>
          </div>

          {/* Card 2: Total Blogs */}
          <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-green-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Database Blogs
              </span>
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold text-white">
                {stats?.totalBlogs ?? 0}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Stored in MongoDB</p>
            </div>
          </div>

          {/* Card 3: Total Views */}
          <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-green-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Article Views
              </span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold text-white">
                {stats?.totalViews ?? 0}
              </h2>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active readership</span>
              </p>
            </div>
          </div>

          {/* Card 4: Total Comments */}
          <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-green-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Comments & Discussions
              </span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold text-white">
                {stats?.totalComments ?? 0}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Community engagement</p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Users & Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Registrations */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>Recent Registrations</span>
            </h3>
            <Link
              href="/admin/users"
              className="text-xs text-green-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No users registered yet.
              </p>
            ) : (
              stats.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] flex items-center justify-center font-bold text-xs text-black flex-shrink-0">
                      {u.firstName?.[0] || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Database Blogs */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0B1323]/90 border border-white/10 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-400" />
              <span>Published Articles</span>
            </h3>
            <Link
              href="/admin/blogs"
              className="text-xs text-green-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage all ({stats?.totalBlogs || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBlogs.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No blogs in database yet.
              </p>
            ) : (
              recentBlogs.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-green-400">
                        {b.category}
                      </span>
                      {b.featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">
                      {b.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-500" />
                      {b.views}
                    </span>
                    <Link
                      href={`/blogs/${b.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                      title="View Article"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
