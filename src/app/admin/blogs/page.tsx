"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getAllBlogsAction, deleteBlogAction, BlogType } from "@/actions/blogs";
import BlogEditorModal from "./BlogEditorModal";

const CATEGORIES = [
  "All",
  "Marketing & Growth",
  "Strategic Networking",
  "Global Expansion",
  "Business Leadership",
  "Tech & Innovation",
  "Community & Scaling",
];

function AdminBlogsContent() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);

  // Delete Confirmation State
  const [deletingBlog, setDeletingBlog] = useState<BlogType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await getAllBlogsAction({
      includeUnpublished: true,
      category: selectedCategory,
      search: searchQuery,
    });
    if (res.success && res.blogs) {
      setBlogs(res.blogs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  // Open create modal if ?create=true in URL
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setEditingBlog(null);
      setIsEditorOpen(true);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleDelete = async () => {
    if (!deletingBlog) return;
    setIsDeleting(true);
    const res = await deleteBlogAction(deletingBlog._id);
    setIsDeleting(false);
    if (res.success) {
      setBlogs((prev) => prev.filter((b) => b._id !== deletingBlog._id));
      setDeletingBlog(null);
      setToastMessage("Article deleted successfully.");
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      alert(res.error || "Failed to delete blog.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast notification */}
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
            <span>Article Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Blogs Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create, edit, and organize all database-backed blog articles and strategic insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogs}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingBlog(null);
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, excerpt, tags, or content keywords..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Categories horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#00DC82] text-black font-bold shadow-md"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Articles Table */}
      <div className="rounded-3xl bg-[#0B1323]/90 border border-white/10 overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-300">
            <thead className="bg-[#0E1528] text-gray-400 uppercase text-[11px] font-semibold border-b border-white/10 tracking-wider">
              <tr>
                <th className="py-4 px-5">Article</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Read Time</th>
                <th className="py-4 px-4">Views</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-green-400" />
                    <span>Loading database blogs...</span>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-semibold text-white">No blogs found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search criteria or write a new article.
                    </p>
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Article Thumbnail & Title */}
                    <td className="py-4 px-5 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-xl overflow-hidden bg-gray-900 border border-white/10 flex-shrink-0">
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-green-400 transition-colors truncate text-sm">
                              {b.title}
                            </span>
                            {b.featured && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 flex-shrink-0">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 font-mono truncate">
                            /{b.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {b.category}
                      </span>
                    </td>

                    {/* Read Time */}
                    <td className="py-4 px-4 whitespace-nowrap text-gray-400">
                      {b.readTime}
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-white">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                        {b.views}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.published
                            ? "bg-green-500/10 text-green-400 border border-green-500/25"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/25"
                        }`}
                      >
                        {b.published ? "LIVE" : "DRAFT"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 whitespace-nowrap text-right space-x-1">
                      <Link
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white inline-block transition-colors"
                        title="Preview Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingBlog(b);
                          setIsEditorOpen(true);
                        }}
                        className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingBlog(b)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Article"
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

      {/* Editor Modal */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaved={fetchBlogs}
        blogToEdit={editingBlog}
      />

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeletingBlog(null)}
          />
          <div className="relative w-full max-w-md bg-[#0A0F1D] border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Article?</h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">&ldquo;{deletingBlog.title}&rdquo;</strong>?
              This will remove the article and all its community comments from MongoDB.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingBlog(null)}
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
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-green-400" />
          <p className="text-sm font-medium">Loading Blogs Management...</p>
        </div>
      }
    >
      <AdminBlogsContent />
    </Suspense>
  );
}
