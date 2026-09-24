"use client";
import React, { useEffect, useState, useRef } from "react";

const STATS = [
  {
    value: "1200",
    suffix: "+",
    label: "Australian Businesses Engaged",
  },
  {
    value: "60",
    suffix: "+",
    label: "Magazine Features Published",
  },
  {
    value: "25",
    suffix: "+",
    label: "Industry & Global Network Partners",
  },
  {
    value: "15",
    suffix: "+",
    label: "Countries Connected Through Our Network",
  },
];

function AnimatedNumber({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={nodeRef}>{count}</span>;
}

export default function StatsBar() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-[66px] mb-16">
      <div className="rounded-3xl bg-[linear-gradient(to_right,#00BF4D_0%,#1C398E_97%)] ">
        <div className="rounded-[22px] bg-[#192132]/60 p-6 sm:p-10 w-full h-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center text-center ${idx > 1 ? "pt-6 lg:pt-0" : idx === 1 ? "pt-0" : ""
                  } ${idx > 0 ? "lg:pl-8" : ""} ${idx < 3 ? "lg:pr-8" : ""}`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-2">
                  <AnimatedNumber end={parseInt(stat.value, 10)} />
                  <span className="text-green-500 font-bold ml-0.5">{stat.suffix}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-[180px] leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
