"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * La goutte — signature de Vintoria.
 * Une seule goutte de vin tombe lentement dans une grande coupe de verre
 * parfaitement visible. À l'impact, une onde élégante se propage à la
 * surface du vin. Calme, cinématographique, mémorable.
 *
 * Perfs : pause hors écran / onglet masqué. Statique si reduced-motion.
 */

const CYCLE = 6.6;
const FALL = 1.4;
const RINGS = 4;

export function DropCoupe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      cx = 0,
      surfaceY = 0,
      bowlRx = 0,
      bowlBottomY = 0,
      footY = 0,
      raf = 0,
      t0 = 0,
      onScreen = true;

    const easeIn = (t: number) => t * t;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    function bowlPath() {
      ctx.beginPath();
      ctx.moveTo(cx - bowlRx, surfaceY);
      ctx.bezierCurveTo(
        cx - bowlRx,
        bowlBottomY - bowlRx * 0.1,
        cx - bowlRx * 0.5,
        bowlBottomY,
        cx,
        bowlBottomY,
      );
      ctx.bezierCurveTo(
        cx + bowlRx * 0.5,
        bowlBottomY,
        cx + bowlRx,
        bowlBottomY - bowlRx * 0.1,
        cx + bowlRx,
        surfaceY,
      );
    }

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      surfaceY = h * 0.34;
      bowlRx = Math.min(w * 0.4, h * 0.3);
      bowlBottomY = surfaceY + bowlRx * 0.58;
      footY = h * 0.93;
    }

    function drawGlass() {
      // corps de la coupe (verre)
      bowlPath();
      const glass = ctx.createLinearGradient(0, surfaceY, 0, bowlBottomY);
      glass.addColorStop(0, "rgba(240,230,213,0.1)");
      glass.addColorStop(1, "rgba(240,230,213,0.03)");
      ctx.fillStyle = glass;
      ctx.fill();
      ctx.strokeStyle = "rgba(212,185,106,0.4)";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // tige + pied
      ctx.strokeStyle = "rgba(212,185,106,0.3)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, bowlBottomY - 2);
      ctx.lineTo(cx, footY);
      ctx.stroke();
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.ellipse(cx, footY, bowlRx * 0.42, bowlRx * 0.09, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fill();
      ctx.stroke();

      // vin (clip au bol)
      ctx.save();
      bowlPath();
      ctx.closePath();
      ctx.clip();
      const wine = ctx.createLinearGradient(0, surfaceY, 0, bowlBottomY);
      wine.addColorStop(0, "#8e2a40");
      wine.addColorStop(1, "#4d1420");
      ctx.fillStyle = wine;
      ctx.fillRect(cx - bowlRx, surfaceY, bowlRx * 2, bowlBottomY - surfaceY);
      ctx.restore();

      // surface du vin
      ctx.beginPath();
      ctx.ellipse(cx, surfaceY, bowlRx * 0.98, bowlRx * 0.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#94304a";
      ctx.fill();
      ctx.strokeStyle = "rgba(216,176,106,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // reflet sur le verre
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, surfaceY + 4, bowlRx * 0.82, Math.PI * 1.16, Math.PI * 1.42);
      ctx.stroke();
    }

    function drawDrop(y: number, stretch: number) {
      ctx.save();
      ctx.translate(cx, y);
      const g = ctx.createRadialGradient(-1, -4, 0.5, 0, 0, 8 * stretch);
      g.addColorStop(0, "rgba(245,214,166,0.95)");
      g.addColorStop(0.45, "rgba(150,42,66,0.95)");
      g.addColorStop(1, "rgba(90,18,32,0.95)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.5, 4.5 * stretch, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawRing(radius: number, alpha: number) {
      ctx.strokeStyle = `rgba(224,186,116,${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, surfaceY, radius, radius * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    function frame(ts: number, staticMode = false) {
      if (!t0) t0 = ts;
      const time = (ts - t0) / 1000;
      const p = staticMode ? 3.0 : time % CYCLE;
      ctx.clearRect(0, 0, w, h);

      drawGlass();

      const maxR = bowlRx * 0.92;
      if (p >= FALL) {
        const age = p - FALL;
        const glow = Math.max(0, 1 - age / 0.6);
        if (glow > 0) {
          const gr = ctx.createRadialGradient(cx, surfaceY, 0, cx, surfaceY, 50);
          gr.addColorStop(0, `rgba(245,214,166,${0.5 * glow})`);
          gr.addColorStop(1, "rgba(245,214,166,0)");
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.ellipse(cx, surfaceY, 50, 10, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let i = 0; i < RINGS; i++) {
          const ra = age - i * 0.42;
          if (ra > 0 && ra < 2.3) {
            const k = ra / 2.3;
            drawRing(easeOut(k) * maxR, (1 - k) * 0.65);
          }
        }

        // débordement maîtrisé → amorce du fil d'or
        const ov = Math.max(0, 1 - age / 1.2);
        if (ov > 0) {
          const frontY = surfaceY + bowlRx * 0.15;
          const dripLen = Math.min(age, 1.2) * bowlRx * 1.1;
          ctx.strokeStyle = `rgba(224,186,116,${0.5 * ov})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, frontY);
          ctx.quadraticCurveTo(cx + 5, frontY + dripLen * 0.55, cx, frontY + dripLen);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, frontY + dripLen, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,230,196,${0.62 * ov})`;
          ctx.fill();
        }
      }

      if (p < FALL) {
        const k = p / FALL;
        const y = -10 + (surfaceY + 10) * easeIn(k);
        drawDrop(y, 1 + k * 1.5);
      }

      if (!staticMode && !reduce && onScreen && !document.hidden) {
        raf = requestAnimationFrame((t) => frame(t));
      } else raf = 0;
    }

    function start() {
      if (raf || reduce) return;
      raf = requestAnimationFrame((t) => frame(t));
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    build();
    if (reduce) frame(0, true);
    else start();

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onResize = () => {
      build();
      if (reduce) frame(0, true);
    };
    const onVis = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
