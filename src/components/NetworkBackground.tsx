"use client";

import { useEffect, useRef } from "react";

/**
 * CONFIGURATION - Interactive Mouse-Line Network Background
 * Section 5A Specification
 */
export const NETWORK_CONFIG = {
  dotDensity: 7000, // 1 dot per ~7,000 px² (~295 dots on 1080p, ~120 on mobile)
  mouseRadius: 220, // Radius around cursor where lines attach (px)
  meshRadius: 105, // Distance threshold for faint dot-to-dot lines near cursor (px)
  lineOpacity: 0.65, // Max line opacity at cursor center
  meshOpacity: 0.22, // Faint mesh line opacity
  dotDrift: 0.35, // Very slow calm drift speed (px per frame)
  fadeMs: 300, // Eased line fade out duration when cursor departs
  haloOffset: 3, // Tiny halo ring around connected dots (radius + 3px)
  spatialCellSize: 120, // Spatial grid cell size for fast localized mesh lookups
};

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseOpacity: number;
  isBodyColored: boolean;
  lineAlpha: number; // Eased line opacity over fadeMs
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let dots: Dot[] = [];

    // Mouse tracking on window (PURE COORDINATES - NO PHYSICS ON DOTS)
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    // Theme color interpolation (400ms smooth crossfade)
    const themeColors = {
      decor: { r: 217, g: 210, b: 199 },
      targetDecor: { r: 217, g: 210, b: 199 },
      body: { r: 98, g: 94, b: 86 },
      targetBody: { r: 98, g: 94, b: 86 },
      accent: { r: 206, g: 48, b: 14 },
      targetAccent: { r: 206, g: 48, b: 14 },
    };

    // Helper: parse hex color string to RGB object
    const parseHex = (hex: string) => {
      const clean = hex.replace("#", "").trim();
      if (clean.length === 6) {
        return {
          r: parseInt(clean.substring(0, 2), 16),
          g: parseInt(clean.substring(2, 4), 16),
          b: parseInt(clean.substring(4, 6), 16),
        };
      }
      return null;
    };

    // Read colors from CSS variables each frame and interpolate over ~400ms
    const updateThemeColors = () => {
      const computed = getComputedStyle(document.documentElement);
      const decorHex = computed.getPropertyValue("--decor").trim() || "#D9D2C7";
      const bodyHex = computed.getPropertyValue("--text-body").trim() || "#625E56";
      const accentHex = computed.getPropertyValue("--accent").trim() || "#CE300E";

      const dRgb = parseHex(decorHex);
      const bRgb = parseHex(bodyHex);
      const aRgb = parseHex(accentHex);

      if (dRgb) themeColors.targetDecor = dRgb;
      if (bRgb) themeColors.targetBody = bRgb;
      if (aRgb) themeColors.targetAccent = aRgb;

      // Smooth ~400ms lerp (factor ~0.08 at 60fps)
      const lerpFactor = 0.08;
      themeColors.decor.r += (themeColors.targetDecor.r - themeColors.decor.r) * lerpFactor;
      themeColors.decor.g += (themeColors.targetDecor.g - themeColors.decor.g) * lerpFactor;
      themeColors.decor.b += (themeColors.targetDecor.b - themeColors.decor.b) * lerpFactor;

      themeColors.body.r += (themeColors.targetBody.r - themeColors.body.r) * lerpFactor;
      themeColors.body.g += (themeColors.targetBody.g - themeColors.body.g) * lerpFactor;
      themeColors.body.b += (themeColors.targetBody.b - themeColors.body.b) * lerpFactor;

      themeColors.accent.r += (themeColors.targetAccent.r - themeColors.accent.r) * lerpFactor;
      themeColors.accent.g += (themeColors.targetAccent.g - themeColors.accent.g) * lerpFactor;
      themeColors.accent.b += (themeColors.targetAccent.b - themeColors.accent.b) * lerpFactor;
    };

    // Initialize and resize dots grid
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Dot density: 1 dot per ~7,000 px²
      const targetCount = Math.max(80, Math.floor((width * height) / NETWORK_CONFIG.dotDensity));

      // Preserve existing dots if already initialized, adjust count
      if (dots.length === 0) {
        dots = Array.from({ length: targetCount }, (_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * 0.2 + 0.15) * NETWORK_CONFIG.dotDrift;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 1.5 + 1.0, // radius 1-2.5px
            baseOpacity: Math.random() * 0.4 + 0.35,
            isBodyColored: i % 6 === 0,
            lineAlpha: 0,
          };
        });
      } else if (dots.length < targetCount) {
        const extra = targetCount - dots.length;
        for (let i = 0; i < extra; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * 0.2 + 0.15) * NETWORK_CONFIG.dotDrift;
          dots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 1.5 + 1.0,
            baseOpacity: Math.random() * 0.4 + 0.35,
            isBodyColored: dots.length % 6 === 0,
            lineAlpha: 0,
          });
        }
      } else if (dots.length > targetCount) {
        dots.length = targetCount;
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(document.body);

    // Mouse listeners on window
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // Fade step per frame (300ms fade = ~18 frames at 60fps)
    const fadeDelta = 1 / (NETWORK_CONFIG.fadeMs / 16.6);

    // Main animation loop
    const render = () => {
      updateThemeColors();
      ctx.clearRect(0, 0, width, height);

      const decorRgb = `${Math.round(themeColors.decor.r)},${Math.round(themeColors.decor.g)},${Math.round(themeColors.decor.b)}`;
      const bodyRgb = `${Math.round(themeColors.body.r)},${Math.round(themeColors.body.g)},${Math.round(themeColors.body.b)}`;
      const accentRgb = `${Math.round(themeColors.accent.r)},${Math.round(themeColors.accent.g)},${Math.round(themeColors.accent.b)}`;

      // 1. UPDATE AND DRIFT DOTS (CALM, CONSTANT VELOCITY - ZERO MOUSE PHYSICS)
      const nearMouseDots: Dot[] = [];

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (!prefersReducedMotion) {
          // Slow constant drift only - dots never get pulled, pushed, thrown or accelerated by mouse
          dot.x += dot.vx;
          dot.y += dot.vy;

          // Seamless edge wrapping
          if (dot.x < -10) dot.x = width + 10;
          else if (dot.x > width + 10) dot.x = -10;
          if (dot.y < -10) dot.y = height + 10;
          else if (dot.y > height + 10) dot.y = -10;
        }

        // Check distance to mouse
        let targetLineAlpha = 0;
        if (mouse.active) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.hypot(dx, dy);

          if (dist < NETWORK_CONFIG.mouseRadius) {
            // Line opacity fades smoothly with distance (close = clearly visible, edge = 0)
            targetLineAlpha = (1 - dist / NETWORK_CONFIG.mouseRadius) * NETWORK_CONFIG.lineOpacity;
            nearMouseDots.push(dot);
          }
        }

        // Smooth per-dot eased opacity over ~300ms so lines never pop on/off
        if (dot.lineAlpha < targetLineAlpha) {
          dot.lineAlpha = Math.min(targetLineAlpha, dot.lineAlpha + fadeDelta * 2);
        } else if (dot.lineAlpha > targetLineAlpha) {
          dot.lineAlpha = Math.max(0, dot.lineAlpha - fadeDelta);
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);

        if (dot.lineAlpha > 0.05) {
          // Connected dots get slightly brighter in accent colour
          ctx.fillStyle = `rgba(${accentRgb}, ${(dot.baseOpacity + 0.35).toFixed(2)})`;
        } else if (dot.isBodyColored) {
          ctx.fillStyle = `rgba(${bodyRgb}, ${(dot.baseOpacity * 0.6).toFixed(2)})`;
        } else {
          ctx.fillStyle = `rgba(${decorRgb}, ${dot.baseOpacity.toFixed(2)})`;
        }
        ctx.fill();

        // Connected dots tiny halo ring (radius + 3px)
        if (dot.lineAlpha > 0.15) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r + NETWORK_CONFIG.haloOffset, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${accentRgb}, ${(dot.lineAlpha * 0.45).toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw line from cursor to this dot (only line drawing - dot position unchanged)
        if (dot.lineAlpha > 0.01 && mouse.active) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(dot.x, dot.y);
          ctx.strokeStyle = `rgba(${accentRgb}, ${dot.lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // 2. FAINT DOT-TO-DOT MESH LINES BETWEEN NEARBY DOTS (< 110px) INSIDE CURSOR RADIUS
      const nearCount = nearMouseDots.length;
      if (nearCount > 1) {
        for (let i = 0; i < nearCount; i++) {
          const d1 = nearMouseDots[i];
          for (let j = i + 1; j < nearCount; j++) {
            const d2 = nearMouseDots[j];
            const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
            if (dist < NETWORK_CONFIG.meshRadius) {
              const meshAlpha = (1 - dist / NETWORK_CONFIG.meshRadius) * NETWORK_CONFIG.meshOpacity * Math.min(d1.lineAlpha, d2.lineAlpha);
              if (meshAlpha > 0.01) {
                ctx.beginPath();
                ctx.moveTo(d1.x, d1.y);
                ctx.lineTo(d2.x, d2.y);
                ctx.strokeStyle = `rgba(${decorRgb}, ${meshAlpha.toFixed(3)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
              }
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    // Pause when tab is hidden
    const onVisibilityChange = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
