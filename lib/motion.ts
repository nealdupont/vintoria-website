import type { Variants, Transition } from "motion/react";

export const easeRobe: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeRobe },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const revealMask: Variants = {
  hidden: { opacity: 0, y: 42, scale: 1.03, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: easeRobe },
  },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;
