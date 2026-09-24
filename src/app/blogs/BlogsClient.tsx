"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Tag,
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/data/blogs";
import { staggerContainer, staggerChild, ScrollReveal } from "@/lib/motion";

const CATEGORIES = [
  "All",
  "Marketing & Growth",
  "Strategic Networking",
  "Global Expansion",
  "Business Leadership",
  "Tech & Innovation",
  "Community & Scaling",
];

export default function BlogsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  const isDefaultView = selectedCategory === "All" && searchQuery.trim() === "";

  return (
    <div className="pt-28 pb-20 overflow-hidden font-poppins min-h-screen">
      {/* Background Ambience Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#00DC82]/10 via-[#1D4ED8]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#00DC82]/5 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-200 font-medium">Blogs & Insights</span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(0,220,130,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RightUp Knowledge Base</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5"
          >
            Smart Insights for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] via-emerald-300 to-blue-400">
              Real Business Growth
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
          >
            Explore practical, high-impact strategies, executive analysis, and vetted growth
            frameworks curated for forward-thinking business leaders.
          </motion.p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12 space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, growth strategies, or authors..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0B1323]/90 border border-white/10 text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 backdrop-blur-xl shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#00DC82] text-black font-semibold shadow-[0_0_15px_rgba(0,220,130,0.3)] scale-[1.02]"
                      : "bg-[#0B1323]/80 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-[#111c34]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post Banner (Visible on default view) */}
        {isDefaultView && featuredPost && (
          <ScrollReveal className="mb-16">
            <div className="relative rounded-3xl bg-[#0B1323]/90 border border-white/15 overflow-hidden backdrop-blur-2xl shadow-2xl hover:border-green-500/40 transition-all duration-300 group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Section */}
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[420px] overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0B1323] via-[#0B1323]/40 to-transparent" />
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#00DC82] text-black shadow-lg">
                      Featured Insight
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-green-400" />
                        {featuredPost.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-green-400" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors leading-snug">
                      <Link href={`/blogs/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                        >
                          <Tag className="w-3 h-3 text-green-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/blogs/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,220,130,0.3)] transition-all hover:gap-3"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Section Heading for Articles List */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              {isDefaultView ? "Latest Articles" : `Results (${filteredPosts.length})`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {isDefaultView
                ? "Browse all published articles and strategic guides"
                : `Showing matching insights for "${selectedCategory}"`}
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-[#0B1323]/50 border border-white/10 p-8">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              We couldn&apos;t find any articles matching your search query. Try searching for different keywords or explore other categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-sm font-semibold hover:bg-green-500/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.slug}
                  layout
                  variants={staggerChild}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="rounded-3xl bg-[#0B1323]/80 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-green-500/40 hover:bg-[#0E1930] transition-colors duration-300 group shadow-xl"
                >
                  <Link href={`/blogs/${post.slug}`} className="block">
                    {/* Blog Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1323] via-transparent to-transparent opacity-85" />

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 inline-block text-[11px] font-bold text-black bg-[#00DC82] px-3 py-1 rounded-full shadow-md">
                        {post.category}
                      </span>

                      {/* Read Time */}
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-medium text-gray-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Clock className="w-3 h-3 text-green-400" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-green-400" />
                        <span>{post.date}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors leading-snug line-clamp-2 mb-3">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-5">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                          >
                            <Tag className="w-2.5 h-2.5 text-green-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>

                  {/* Read More Footer */}
                  <div className="px-6 sm:px-7 pb-6">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 group-hover:text-white transition-colors"
                    >
                      <span>Read Full Insight</span>
                      <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom Newsletter CTA Banner */}
        <ScrollReveal className="mt-20">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0B1323] via-[#0E1A34] to-[#0B1323] border border-white/15 p-8 sm:p-12 overflow-hidden text-center shadow-2xl">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10 space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/25 text-green-400 uppercase tracking-wider">
                Stay Informed
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Get Executive Insights Delivered Weekly
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Join over 2,500+ Australian business leaders and founders receiving our curated
                market intelligence, partnership opportunities, and growth playbooks.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to RightUp Insights!");
                }}
                className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your work email"
                  className="flex-1 px-4 py-3 rounded-full bg-[#070B12] border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-sm shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
