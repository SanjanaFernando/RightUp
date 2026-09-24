"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle2,
  Quote,
  Sparkles,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { BlogPost } from "@/data/blogs";
import { ScrollReveal, staggerContainer, staggerChild } from "@/lib/motion";
import BlogComments from "@/components/BlogComments";

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogDetailClient({
  post,
  relatedPosts,
}: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // Reading Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" via @RightUp`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        currentUrl
      )}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      "_blank"
    );
  };

  return (
    <div className="pt-28 pb-24 font-poppins relative min-h-screen">
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00DC82] via-emerald-400 to-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#00DC82]/10 via-[#1D4ED8]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href="/blogs" className="hover:text-green-400 transition-colors">
              Blogs
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-300 font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.category}
            </span>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-5 mb-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#00DC82] text-black shadow-md">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3 text-green-400" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Calendar className="w-3 h-3 text-green-400" />
              {post.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="pt-4 pb-2 border-y border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">RightUp Admin</p>
                <p className="text-[11px] text-gray-400">Official Editorial</p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Share:</span>
              <button
                onClick={shareOnLinkedIn}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={shareOnTwitter}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={shareOnFacebook}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  copied
                    ? "bg-green-500 text-black shadow-[0_0_10px_rgba(0,220,130,0.4)]"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Key Takeaways Box */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <ScrollReveal className="mb-12">
            <div className="rounded-2xl bg-gradient-to-br from-[#0B1323] via-[#0E1A33] to-[#0B1323] border border-green-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm sm:text-base uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary & Key Takeaways</span>
              </div>
              <ul className="space-y-3">
                {post.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-200">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* Article Body Content */}
        <div className="space-y-10 text-gray-200 text-base sm:text-lg leading-relaxed">
          {post.sections.map((section, idx) => (
            <div key={idx} className="space-y-5">
              {section.heading && (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-4">
                  {section.heading}
                </h2>
              )}

              {section.subheading && (
                <h3 className="text-lg sm:text-xl font-bold text-green-400">
                  {section.subheading}
                </h3>
              )}

              <p className="text-gray-300 leading-relaxed">{section.body}</p>

              {/* Styled Blockquote */}
              {section.quote && (
                <div className="relative my-6 rounded-2xl bg-[#0F182E]/90 border-l-4 border-green-400 p-6 sm:p-8 backdrop-blur-md shadow-lg">
                  <Quote className="w-8 h-8 text-green-400/40 mb-2" />
                  <p className="text-lg sm:text-xl font-semibold italic text-white leading-snug">
                    &ldquo;{section.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* List items if any */}
              {section.list && section.list.length > 0 && (
                <div className="my-5 rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-7">
                  <ul className="space-y-3">
                    {section.list.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Article Tags */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-green-400" />
            Article Tags:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium text-gray-300 bg-white/5 border border-white/10 hover:border-green-400/50 hover:text-white transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Interactive Comments Section */}
        <BlogComments blogSlug={post.slug} />

        {/* CTA Banner: Join RightUp */}
        <ScrollReveal className="mt-16">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#0B1323] to-blue-950/50 border border-green-500/30 p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-xl mx-auto space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#00DC82] text-black inline-block uppercase tracking-wider">
                Unlock Real Opportunities
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to Grow with Verified Business Leaders?
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect with pre-vetted founders, enterprise executives, and strategic partners
                tailored specifically to your growth targets.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="px-7 py-3 rounded-full bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,220,130,0.3)] transition-all"
                >
                  Join RightUp Network
                </Link>
                <Link
                  href="/#memberships"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all"
                >
                  View Memberships
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Related Insights</h2>
              <Link
                href="/blogs"
                className="text-xs sm:text-sm font-semibold text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {relatedPosts.map((rPost) => (
                <motion.article
                  key={rPost.slug}
                  variants={staggerChild}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-[#0B1323]/90 border border-white/10 overflow-hidden group flex flex-col justify-between hover:border-green-500/40 transition-all shadow-lg"
                >
                  <Link href={`/blogs/${rPost.slug}`}>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                      <Image
                        src={rPost.image}
                        alt={rPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#00DC82] text-black px-2.5 py-0.5 rounded-full">
                        {rPost.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <span>{rPost.date}</span>
                        <span>•</span>
                        <span>{rPost.readTime}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                        {rPost.title}
                      </h3>
                    </div>
                  </Link>

                  <div className="px-5 pb-5">
                    <Link
                      href={`/blogs/${rPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 group-hover:text-white transition-colors"
                    >
                      <span>Read Insight</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
