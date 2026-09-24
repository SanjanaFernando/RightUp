import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blogs & Insights | RightUp - Strategic Business Growth",
  description:
    "Explore strategic business insights, market intelligence, high-trust networking frameworks, and enterprise scaling playbooks from RightUp.",
  keywords: [
    "RightUp Blogs",
    "Business Networking Australia",
    "Enterprise Growth Playbooks",
    "Strategic Partnerships",
    "Executive Insights",
  ],
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#070B12] text-gray-100 selection:bg-green-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Interactive Blogs View */}
      <BlogsClient />

      {/* Footer */}
      <Footer />
    </main>
  );
}
