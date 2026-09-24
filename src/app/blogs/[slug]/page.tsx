import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getBlogPostBySlug, getRelatedBlogPosts } from "@/data/blogs";
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found | RightUp",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${post.title} | RightUp Insights`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: ["RightUp Admin"],
    },
  };
}

export default function BlogDetailPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, 3);

  return (
    <main className="min-h-screen bg-[#070B12] text-gray-100 selection:bg-green-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Blog Detail Interactive Content */}
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
