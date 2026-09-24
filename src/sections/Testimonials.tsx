import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

const TESTIMONIALS = [
  {
    name: "Olivia Reynolds",
    role: "Founder of Elevate Solutions",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "RightUp has completely transformed the way we build business relationships. Through their network, we've formed partnerships that directly increased our revenue and visibility in the market.",
  },
  {
    name: "Ahmed Khan",
    role: "Co-Founder of TechBridge Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "RightUp helped us expand into new markets through powerful introductions and trusted referrals. The connections we've built through the platform have led to meaningful partnerships and measurable growth. It has quickly become an essential part of our overall business development strategy.",
  },
  {
    name: "James Carter",
    role: "CEO of UrbanCore Developments",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "Within just a few months of joining RightUp, we secured two major collaborations. The platform makes it easy to connect with decision-makers and serious entrepreneurs.",
  },
  {
    name: "Daniel Morris",
    role: "Managing Director at Nexus Consulting",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    quote:
      "The quality of professionals on RightUp is outstanding. Every connection feels meaningful and aligned with our business goals. It's more than networking — it's real growth.",
  },
  {
    name: "Olivia Reynolds",
    role: "Founder of Elevate Solutions",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    quote:
      "RightUp has completely transformed the way we build business relationships.",
  },
  {
    name: "Olivia Reynolds",
    role: "Founder of Elevate Solutions",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote:
      "RightUp has completely transformed the way we build business relationships. Through their network, we've formed partnerships that directly increased our revenue and visibility in the market.",
  },
];

const TestimonialCard = ({ item }: { item: { name: string; role: string; avatar: string; quote: string } }) => (
  <div className="group relative rounded-[40px] bg-[#313338] border-2 border-transparent hover:border-blue-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] p-8 sm:p-10 flex flex-col shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
    <div className="flex items-center gap-4 mb-6">
      <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-[#2563EB] group-hover:border-blue-400 transition-colors duration-500 flex-shrink-0 shadow-lg">
        <Image
          src={item.avatar}
          alt={item.name}
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>
      <div>
        <h3 className="text-[18px] sm:text-[20px] font-medium text-white leading-tight">
          {item.name},
        </h3>
        <p className="text-[14px] text-gray-300 transition-colors duration-500 mt-1 font-light">
          {item.role}
        </p>
      </div>
    </div>
    <p className="text-[14px] text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-[1.8] font-light">
      &ldquo;{item.quote}&rdquo;
    </p>
  </div>
);

export default function Testimonials() {
  return (
    <section id="about" className="relative  overflow-hidden">
      <SectionHeader
        watermarkText="TESTIMONIALS"
        title="What our clients are saying"
        subtitle="Right Up brings together the people, partnerships and opportunities shaping business growth across Australia and the world."
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-[100px] sm:px-6 lg:px-8">

        {/* Testimonial Cards */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {[TESTIMONIALS[0], TESTIMONIALS[3]].map((item, idx) => (
              <TestimonialCard key={`col1-${idx}`} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {[TESTIMONIALS[1], TESTIMONIALS[4]].map((item, idx) => (
              <TestimonialCard key={`col2-${idx}`} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {[TESTIMONIALS[2], TESTIMONIALS[5]].map((item, idx) => (
              <TestimonialCard key={`col3-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
