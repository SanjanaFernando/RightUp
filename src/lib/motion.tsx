"use client";

/**
 * Reusable Framer Motion animation variants and a scroll-triggered wrapper.
 * Import these across every section to keep animations consistent.
 */
import React from "react";
import {
  motion,
  useInView,
  Variants,
  HTMLMotionProps,
} from "framer-motion";

// ─── Shared Variants ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Stagger children container */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/** Each staggered child */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── ScrollReveal Wrapper ────────────────────────────────────────────────────

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  variants?: Variants;
  custom?: number; // delay in seconds
  once?: boolean;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Drop-in wrapper that animates children when they enter the viewport.
 *
 * Usage:
 *   <ScrollReveal variants={fadeUp} custom={0.2}>
 *     <h2>...</h2>
 *   </ScrollReveal>
 */
export function ScrollReveal({
  variants = fadeUp,
  custom = 0,
  once = true,
  threshold = 0.15,
  className,
  children,
  ...rest
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={custom}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Same as ScrollReveal but renders as a <section> tag.
 */
export function ScrollRevealSection({
  variants = fadeIn,
  custom = 0,
  once = true,
  threshold = 0.1,
  className,
  children,
  ...rest
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  return (
    <motion.section
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={custom}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
