"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Reply,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  ArrowUpDown,
  CornerDownRight,
  Loader2,
} from "lucide-react";
import {
  CommentType,
  getCommentsAction,
  addCommentAction,
  toggleLikeCommentAction,
} from "@/actions/comments";
import { useAuthStore } from "@/store/authStore";

interface BlogCommentsProps {
  blogSlug: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CommentAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string;
  name: string;
  size?: "sm" | "md";
}) {
  const [hasError, setHasError] = useState(false);
  const dimClass = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm";

  if (src && !hasError) {
    return (
      <div className={`relative ${dimClass} rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-gray-900`}>
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          onError={() => setHasError(true)}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dimClass} rounded-full bg-gradient-to-tr from-[#00DC82] to-[#1D4ED8] flex items-center justify-center text-black font-bold flex-shrink-0 shadow-md`}
    >
      {getInitials(name)}
    </div>
  );
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogComments({ blogSlug }: BlogCommentsProps) {
  const { user: currentUser } = useAuthStore();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Unique client identifier for guest likes
  const [clientIdentifier, setClientIdentifier] = useState("guest-user");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("rightup_commenter_id");
      if (!storedId) {
        storedId = `client-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("rightup_commenter_id", storedId);
      }
      setClientIdentifier(currentUser?.email || storedId);
    }
  }, [currentUser]);

  // Load comments
  useEffect(() => {
    let mounted = true;
    async function loadComments() {
      setLoading(true);
      const res = await getCommentsAction(blogSlug);
      if (mounted && res.success) {
        setComments(res.comments);
      }
      if (mounted) setLoading(false);
    }
    loadComments();
    return () => {
      mounted = false;
    };
  }, [blogSlug]);

  // If user is logged in, auto-fill author details
  useEffect(() => {
    if (currentUser) {
      setAuthorName(`${currentUser.firstName} ${currentUser.lastName}`.trim());
      setAuthorEmail(currentUser.email || "");
      setAuthorTitle(currentUser.title || currentUser.companyName || "Verified Member");
    }
  }, [currentUser]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const name = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : authorName.trim() || "Anonymous Leader";

    setSubmitting(true);
    const res = await addCommentAction({
      blogSlug,
      userName: name,
      userEmail: currentUser?.email || authorEmail,
      userAvatar: currentUser?.avatarUrl || "",
      userTitle: currentUser?.title || authorTitle || "Industry Professional",
      userId: currentUser?.userId,
      content: commentText.trim(),
    });

    setSubmitting(false);
    if (res.success && res.comment) {
      setComments((prev) => [res.comment!, ...prev]);
      setCommentText("");
      setSuccessMessage("Comment published successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    const name = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : authorName.trim() || "Anonymous Leader";

    setReplySubmitting(true);
    const res = await addCommentAction({
      blogSlug,
      userName: name,
      userEmail: currentUser?.email || authorEmail,
      userAvatar: currentUser?.avatarUrl || "",
      userTitle: currentUser?.title || authorTitle || "Industry Professional",
      userId: currentUser?.userId,
      content: replyText.trim(),
      parentId,
    });

    setReplySubmitting(false);
    if (res.success && res.comment) {
      setComments((prev) => [...prev, res.comment!]);
      setReplyText("");
      setReplyingToId(null);
    }
  };

  const handleLike = async (commentId: string) => {
    const isLiked = likedMap[commentId];
    setLikedMap((prev) => ({ ...prev, [commentId]: !isLiked }));

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          return {
            ...c,
            likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          };
        }
        return c;
      })
    );

    await toggleLikeCommentAction(commentId, clientIdentifier);
  };

  // Group top-level comments & replies
  const rootComments = useMemo(() => {
    const roots = comments.filter((c) => !c.parentId);
    if (sortBy === "likes") {
      return [...roots].sort((a, b) => b.likes - a.likes);
    }
    return [...roots].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments, sortBy]);

  const repliesByParent = useMemo(() => {
    const map: Record<string, CommentType[]> = {};
    comments
      .filter((c) => c.parentId)
      .forEach((r) => {
        if (!map[r.parentId!]) map[r.parentId!] = [];
        map[r.parentId!].push(r);
      });
    return map;
  }, [comments]);

  return (
    <section className="mt-16 pt-10 border-t border-white/10 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Discussion & Perspectives</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-semibold">
                {comments.length}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Join the conversation with Australian business executives and founders
            </p>
          </div>
        </div>

        {/* Sort Selector */}
        {comments.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-green-400" />
              Sort:
            </span>
            <div className="flex bg-[#0B1323] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sortBy === "newest"
                    ? "bg-green-500/20 text-green-400 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sortBy === "likes"
                    ? "bg-green-500/20 text-green-400 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Top Liked
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1323] via-[#0D182E] to-[#0B1323] border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleAddComment} className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              Leave Your Perspective
            </h3>

            {currentUser && (
              <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Member
              </span>
            )}
          </div>

          {/* Guest User Fields (shown when logged out) */}
          {!currentUser && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Liam Smith"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">
                  Job Title / Organization
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="e.g. Managing Partner, Acme Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">
                  Email (Optional / Kept Private)
                </label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="liam@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Comment Textarea */}
          <div className="relative">
            <textarea
              required
              rows={4}
              maxLength={1000}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this strategy? Share your insights or questions..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#070B12]/90 border border-white/10 text-white placeholder-gray-500 text-sm leading-relaxed focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 transition-all resize-none"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 px-1">
              <span>Be respectful, constructive, and relevant to the discussion.</span>
              <span>{commentText.length}/1000</span>
            </div>
          </div>

          {/* Submit Button & Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {successMessage ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                {successMessage}
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>Post Comment</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3.5 bg-white/10 rounded" />
                  <div className="w-20 h-2.5 bg-white/10 rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-[#0B1323]/50 border border-white/10 p-8">
          <MessageSquare className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white mb-1">No comments yet</h4>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
            Be the first to share your thoughts, strategic questions, or key takeaways with the
            community.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {rootComments.map((comment) => {
              const replies = repliesByParent[comment._id] || [];
              const isLiked = likedMap[comment._id];
              const isReplying = replyingToId === comment._id;

              return (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-[#0B1323]/80 border border-white/10 p-6 sm:p-7 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300"
                >
                  {/* Comment Author Row */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <CommentAvatar src={comment.userAvatar} name={comment.userName} size="md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{comment.userName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                            {comment.userTitle || "Verified Member"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span>{timeAgo(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed pl-14 mb-4">
                    {comment.content}
                  </p>

                  {/* Actions: Like & Reply */}
                  <div className="flex items-center gap-4 pl-14 text-xs">
                    <button
                      onClick={() => handleLike(comment._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                        isLiked
                          ? "bg-red-500/15 text-red-400 border border-red-500/30 font-semibold"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
                      <span>{comment.likes}</span>
                    </button>

                    <button
                      onClick={() => setReplyingToId(isReplying ? null : comment._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{isReplying ? "Cancel" : "Reply"}</span>
                    </button>
                  </div>

                  {/* Inline Reply Input */}
                  {isReplying && (
                    <div className="mt-4 ml-14 pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Replying to {comment.userName}</span>
                      </div>
                      <textarea
                        rows={2}
                        maxLength={500}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400 resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToId(null);
                            setReplyText("");
                          }}
                          className="px-3.5 py-1.5 rounded-full text-xs text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={replySubmitting || !replyText.trim()}
                          onClick={() => handleAddReply(comment._id)}
                          className="px-4 py-1.5 rounded-full bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-xs shadow-md transition-all disabled:opacity-50"
                        >
                          {replySubmitting ? "Posting..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies List */}
                  {replies.length > 0 && (
                    <div className="mt-5 ml-8 sm:ml-14 space-y-4 pt-4 border-t border-white/10">
                      {replies.map((reply) => {
                        const isReplyLiked = likedMap[reply._id];
                        return (
                          <div
                            key={reply._id}
                            className="rounded-2xl bg-[#070B12]/80 border border-white/10 p-4 sm:p-5"
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2.5">
                                <CommentAvatar src={reply.userAvatar} name={reply.userName} size="sm" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white">
                                      {reply.userName}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                      {reply.userTitle || "Member"}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-500">
                                    {timeAgo(reply.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-300 pl-10 leading-relaxed mb-2">
                              {reply.content}
                            </p>
                            <div className="pl-10">
                              <button
                                onClick={() => handleLike(reply._id)}
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full transition-all ${
                                  isReplyLiked
                                    ? "bg-red-500/15 text-red-400 font-semibold"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <Heart
                                  className={`w-3 h-3 ${
                                    isReplyLiked ? "fill-red-400 text-red-400" : ""
                                  }`}
                                />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
