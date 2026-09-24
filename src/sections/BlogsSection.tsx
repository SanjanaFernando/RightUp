"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { ScrollReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { BLOG_POSTS } from "@/data/blogs";

export default function BlogsSection() {
  const displayPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section id="blogs" className="relative py-24 overflow-hidden">
      <ScrollReveal>
        <SectionHeader
          watermarkText="BLOGS"
          title="Smart Insights for Real Business Growth"
          subtitle="Explore practical, high-impact insights to strengthen your positioning, build strategic connections, and unlock new growth opportunities."
        />
      </ScrollReveal>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {displayPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              variants={staggerChild}
              whileHover={{ y: -10, boxShadow: "0 24px 50px -12px rgba(0,0,0,0.6)" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="rounded-3xl bg-[#0B1323]/80 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-green-500/40 hover:bg-[#0E1930] transition-colors duration-300 group shadow-xl"
            >
              <div>
                {/* Blog Image */}
                <Link href={`/blogs/${post.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1323] via-transparent to-transparent opacity-80" />

                  {/* Tag pill */}
                  <motion.span
                    className="absolute top-4 left-4 inline-block text-[10px] font-bold text-black bg-green-400 px-3 py-1 rounded-full"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                  >
                    {post.date}
                  </motion.span>
                </Link>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <span className="inline-block text-xs font-semibold text-green-500 mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors leading-snug line-clamp-2">
                    <Link href={`/blogs/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                </div>
              </div>

              {/* Read More */}
              <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-green-400 transition-all"
                >
                  <span>Read More</span>
                  <motion.span whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <ArrowRight className="w-4 h-4 text-green-500" />
                  </motion.span>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Blogs CTA Button */}
        <div className="mt-14 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B1323] border border-green-500/40 text-white font-semibold text-sm hover:bg-[#00DC82] hover:text-black hover:border-[#00DC82] transition-all duration-300 shadow-[0_0_20px_rgba(0,220,130,0.15)] group"
          >
            <BookOpen className="w-4 h-4 text-green-400 group-hover:text-black transition-colors" />
            <span>View All Insights & Articles</span>
            <ArrowRight className="w-4 h-4 text-green-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
}

