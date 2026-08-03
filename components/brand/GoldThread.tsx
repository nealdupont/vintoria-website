"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

type Node = { x: number; y: number; cx: number; t: number };

/**
 * Le fil d'or — fil conducteur de toute l'expérience Vintoria.
 * Né de la goutte (il démarre à la surface de la coupe), il se dessine
 * au scroll, se ramifie pour alimenter chaque section et allume ses
 * nœuds quand on les atteint. Une seule histoire, du début à la fin.
 *
 * Discret, performant (tête via motion values, pas de re-render),
 * statique si prefers-reduced-motion.
 */

function ThreadNode({
  node,
  progress,
}: {
  node: Node;
  progress: MotionValue<number>;
}) {
  const dot = useTransform(progress, [node.t - 0.05, node.t], [0.12, 1]);
  const branch = useTransform(progress, [node.t - 0.02, node.t + 0.04], [0, 0.55]);
  const bd = `M${node.x.toFixed(1)} ${node.y} Q ${((node.x + node.cx) / 2).toFixed(1)} ${node.y - 9} ${node.cx.toFixed(1)} ${node.y}`;
  return (
    <>
      <motion.path
        d={bd}
        stroke="#d4b96a"
        strokeWidth={1}
        fill="none"
        strokeLinecap="round"
        style={{ opacity: branch }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={3}
        fill="#e6cf94"
        style={{ opacity: dot }}
      />
    </>
  );
}

export function GoldThread() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const brightRef = useRef<SVGPathElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [d, setD] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);

  const { scrollYProgress } = useScroll();
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headO = useMotionValue(0);

  const xAt = (y: number, w: number) => {
    const cx = w * 0.5;
    const amp = Math.min(w * 0.2, 200);
    return cx + amp * Math.sin(y * 0.0016 + 1.2) * Math.cos(y * 0.0006);
  };

  useEffect(() => {
    function build() {
      const parent = wrapRef.current?.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.scrollHeight;
      if (!w || !h) return;

      // origine : la surface de la coupe
      const origin = parent.querySelector<HTMLElement>("#thread-origin");
      const pRect = parent.getBoundingClientRect();
      let x0 = xAt(0, w);
      let y0 = 0;
      if (origin) {
        const r = origin.getBoundingClientRect();
        x0 = r.left - pRect.left + r.width / 2;
        y0 = r.top - pRect.top + r.height * 0.34;
      }
      const shift = x0 - xAt(y0, w);
      const xThread = (y: number) =>
        xAt(y, w) + shift * Math.max(0, 1 - (y - y0) / 720);

      setDims({ w, h });

      let dd = "";
      for (let y = y0; y <= h; y += 22) {
        const x = xThread(y);
        dd += y === y0 ? `M${x.toFixed(1)} ${y.toFixed(0)}` : ` L${x.toFixed(1)} ${y.toFixed(0)}`;
      }
      setD(dd);

      const secs = Array.from(
        parent.querySelectorAll<HTMLElement>("section[id]"),
      );
      setNodes(
        secs
          .map((s) => {
            const y = s.offsetTop + 56;
            return { x: xThread(y), y, cx: w * 0.5, t: y / h };
          })
          .filter((n) => n.y > y0 + 40),
      );
    }
    build();
    const ro = new ResizeObserver(build);
    const parent = wrapRef.current?.parentElement;
    if (parent) ro.observe(parent);
    window.addEventListener("resize", build);
    const t = setTimeout(build, 700);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", build);
      clearTimeout(t);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const path = brightRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    if (!len) return;
    const pt = path.getPointAtLength(len * p);
    headX.set(pt.x);
    headY.set(pt.y);
    headO.set(p > 0.004 && p < 0.996 ? 1 : 0);
  });

  const pathLen = reduce ? 1 : scrollYProgress;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {dims.w > 0 && (
        <svg
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          fill="none"
          className="absolute inset-0"
        >
          <motion.path
            ref={brightRef}
            d={d}
            stroke="#d4b96a"
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.16}
            style={{ pathLength: pathLen, filter: "blur(6px)" }}
          />
          <motion.path
            d={d}
            stroke="#e6cf94"
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.55}
            style={{ pathLength: pathLen }}
          />

          {!reduce &&
            nodes.map((n, i) => (
              <ThreadNode key={i} node={n} progress={scrollYProgress} />
            ))}

          {!reduce && (
            <>
              <motion.circle
                cx={headX}
                cy={headY}
                r={9}
                fill="#d4b96a"
                style={{ opacity: headO, filter: "blur(5px)" }}
              />
              <motion.circle
                cx={headX}
                cy={headY}
                r={2.6}
                fill="#f5e6c4"
                style={{ opacity: headO }}
              />
            </>
          )}
        </svg>
      )}
    </div>
  );
}
