"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Eye,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Target,
  Zap,
} from "lucide-react";
import {
  getAdminUsersAction,
  updateUserRoleAction,
  deleteUserAction,
  AdminUserType,
} from "@/actions/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Selected User Detail Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserType | null>(null);

  // Delete Confirmation Modal State
  const [deletingUser, setDeletingUser] = useState<AdminUserType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAdminUsersAction({
      role: selectedRole,
      search: searchQuery,
    });
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleToggle = async (u: AdminUserType) => {
    const nextRole: "user" | "admin" = u.role === "admin" ? "user" : "admin";
    const res = await updateUserRoleAction(u._id, nextRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((item) => (item._id === u._id ? { ...item, role: nextRole } : item))
      );
      if (selectedUser && selectedUser._id === u._id) {
        setSelectedUser({ ...selectedUser, role: nextRole });
      }
      setToastMessage(`Role updated to ${nextRole.toUpperCase()} for ${u.firstName}.`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      alert(res.error || "Failed to update role.");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    const res = await deleteUserAction(deletingUser._id);
    setIsDeleting(false);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      if (selectedUser?._id === deletingUser._id) {
        setSelectedUser(null);
      }
      setDeletingUser(null);
      setToastMessage("User account removed successfully.");
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      alert(res.error || "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#00DC82] text-black font-bold text-xs sm:text-sm shadow-2xl animate-[slideDownFade_0.2s_ease-out] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Users & Members Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review registered founders, enterprise leaders, role authorizations, and onboarding details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company, or industry..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400"
          />
        </form>

        {/* Role Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["All", "Admin", "User"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedRole === r
                  ? "bg-[#00DC82] text-black font-bold shadow-md"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {r === "All" ? "All Roles" : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-300">
            <thead className="bg-[#0E1528] text-gray-400 uppercase text-[11px] font-semibold border-b border-white/10 tracking-wider">
              <tr>
                <th className="py-4 px-5">Member</th>
                <th className="py-4 px-4">Company & Role</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Account Role</th>
                <th className="py-4 px-4">Joined</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-green-400" />
                    <span>Loading members...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-semibold text-white">No members found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try searching with different keywords.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Member Name & Email */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] flex items-center justify-center font-bold text-xs text-black flex-shrink-0 shadow-md">
                          {u.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-green-400 transition-colors">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company / Title */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="text-white font-medium">
                        {u.companyName || "Independent"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {u.title || u.industry || "Professional"}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap text-gray-400">
                      {u.city ? `${u.city}, ` : ""}
                      {u.country || "Australia"}
                    </td>

                    {/* Account Role Badge / Switch */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        title="Click to toggle Admin / User role"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          u.role === "admin"
                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25"
                            : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        <span>{u.role.toUpperCase()}</span>
                      </button>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white inline-block transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingUser(u)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Slideover / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#0A0F1D] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] flex items-center justify-center font-bold text-base text-black flex-shrink-0 shadow-lg">
                  {selectedUser.firstName?.[0] || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedUser.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-green-500/15 text-green-400 border border-green-500/25"
                      }`}
                    >
                      {selectedUser.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-green-400" />
                  Company & Industry
                </span>
                <p className="text-sm font-bold text-white">
                  {selectedUser.companyName || "Not specified"}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedUser.industry || "General Business"} • {selectedUser.companySize || "1-10"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-green-400" />
                  Location
                </span>
                <p className="text-sm font-bold text-white">
                  {selectedUser.city ? `${selectedUser.city}, ` : ""}
                  {selectedUser.state ? `${selectedUser.state}, ` : ""}
                  {selectedUser.country || "Australia"}
                </p>
                <p className="text-xs text-gray-400">
                  Phone: {selectedUser.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Onboarding Intent & Goals */}
            <div className="space-y-4">
              {selectedUser.intent && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Primary Intent
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200">
                    {selectedUser.intent}
                  </p>
                </div>
              )}

              {selectedUser.goals && selectedUser.goals.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Strategic Goals
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.goals.map((g, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-green-500/10 text-green-400 border border-green-500/20 font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.strengths && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-gray-400">
                    Strengths & Value Offered:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200">
                    {selectedUser.strengths}
                  </p>
                </div>
              )}

              {selectedUser.challenges && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-gray-400">
                    Immediate Challenges & Needs:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200">
                    {selectedUser.challenges}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => handleRoleToggle(selectedUser)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Switch Role to {selectedUser.role === "admin" ? "USER" : "ADMIN"}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00DC82] text-black hover:bg-[#00c574] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          />
          <div className="relative w-full max-w-md bg-[#0A0F1D] border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete User Account?</h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete the account for{" "}
              <strong className="text-white">
                {deletingUser.firstName} {deletingUser.lastName} ({deletingUser.email})
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
