import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import StatsBar from "@/sections/StatsBar";
import Testimonials from "@/sections/Testimonials";
import ServicesSection from "@/sections/ServicesSection";
import MembershipTiers from "@/sections/MembershipTiers";
import WhyChooseUs from "@/sections/WhyChooseUs";
import BlogsSection from "@/sections/BlogsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070B12] text-gray-100 selection:bg-green-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Key Metrics Bar */}
      <StatsBar />

      {/* Testimonials */}
      <Testimonials />

      {/* What We Do / Services Section */}
      <ServicesSection />

      {/* Membership Tiers */}
      <MembershipTiers />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Blogs & Insights */}
      <BlogsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
