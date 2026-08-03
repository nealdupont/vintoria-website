"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "section" | "span" | "p";
  role?: string;
  stagger?: boolean;
};

export function Reveal({
  children,
  className,
  variants,
  as = "div",
  role,
  stagger: withStagger = false,
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      role={role}
      variants={variants ?? (withStagger ? stagger : fadeUp)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  role,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "span" | "p";
  role?: string;
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} role={role} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}
