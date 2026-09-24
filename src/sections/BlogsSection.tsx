import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const BLOG_POSTS = [
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    tag: "Smart insights for Real Business Growth",
    title: "The World That Marketing Built and Why It No Longer Works",
    date: "Sep 2026",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    tag: "Smart insights for Real Business Growth",
    title: "The World That Marketing Built and Why It No Longer Works",
    date: "Sep 2026",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
    tag: "Smart insights for Real Business Growth",
    title: "The World That Marketing Built and Why It No Longer Works",
    date: "Aug 2026",
    href: "#",
  },
];

export default function BlogsSection() {
  return (
    <section id="blogs" className="relative py-24 overflow-hidden">
      <SectionHeader
        watermarkText="BLOGS"
        title="Smart Insights for Real Business Growth"
        subtitle="Explore practical, high-impact insights to strengthen your positioning, build strategic connections, and unlock new growth opportunities."
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <article
              key={idx}
              className="rounded-3xl bg-[#0B1323]/80 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-white/25 hover:bg-[#0E1930] transition-all duration-300 group hover:-translate-y-2 shadow-xl"
            >
              <div>
                {/* Blog Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1323] via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <span className="inline-block text-xs font-semibold text-green-500 mb-2">
                    {post.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Read More link */}
              <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                <Link
                  href={post.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-white group-hover:gap-3 transition-all"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
