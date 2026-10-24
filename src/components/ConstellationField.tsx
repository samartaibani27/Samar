"use client";

import { useEffect, useRef } from "react";

/**
 * LIVING CONSTELLATION ENGINE - CONFIGURATION
 * Tune all visual, physics, and interaction parameters here.
 */
export const CONSTELLATION_CONFIG = {
  // Density and counts
  desktopCount: 95,
  mobileCount: 42,
  linkDistance: 140,
  maxNeighbors: 3, // Delaunay-like nearest neighbors per node

  // Mouse interaction
  mouseRadius: 210,
  orbitDistance: 80, // Target distance where particles spring-orbit
  orbitSpring: 0.045, // Gentle attraction spring force
  orbitTangential: 0.12, // Slight angular swirl around cursor
  shockwaveSpeedThreshold: 22, // Mouse speed threshold to trigger repulsive shockwave
  shockwaveForce: 6.5,
  damping: 0.92, // Velocity damping for organic glide

  // Visuals and depth
  parallaxFactor: 18, // Max px shift opposite mouse
  spotlightRadius: 220, // Radius of subtle revealed micro dot-grid
  haloRadiusOffset: 6, // Halo ring size around connected nodes

  // Ripple and idle life
  sparkCount: 12,
  idlePulseDelayMs: 3000,
  idlePulseSpeed: 0.035, // Progress per frame along link
  spatialCellSize: 150, // Spatial hash grid cell size
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  r: number;
  layer: number; // 0: Far, 1: Mid, 2: Near
  isAnchor: boolean;
  pulseProgress?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
}

interface ClickRipple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  opacity: number;
}

interface LinePulse {
  p1: Particle;
  p2: Particle;
  progress: number;
}

export function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // State collections
    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let ripples: ClickRipple[] = [];
    let pulses: LinePulse[] = [];

    // Mouse tracking
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      speed: 0,
      active: false,
      lastMoveTime: performance.now(),
    };

    // Parallax tracking
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Scroll reactivity
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollStretch = 1;

    // Theme color interpolation (400ms smooth lerp)
    const currentTheme = {
      isDark: false,
      ink: { r: 20, g: 19, b: 16 },
      targetInk: { r: 20, g: 19, b: 16 },
      accent: { r: 212, g: 56, b: 18 },
      targetAccent: { r: 212, g: 56, b: 18 },
    };

    // Pre-rendered offscreen bloom sprite for 60fps glow (no expensive shadowBlur)
    const bloomCanvas = document.createElement("canvas");
    bloomCanvas.width = 48;
    bloomCanvas.height = 48;
    const bCtx = bloomCanvas.getContext("2d");
    if (bCtx) {
      const grad = bCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      grad.addColorStop(0.35, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.arc(24, 24, 24, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Adaptive performance monitoring
    let lastFrameTime = performance.now();
    let slowFrames = 0;

    // Spatial Hash Grid
    const spatialGrid = new Map<string, Particle[]>();
    const getGridKey = (x: number, y: number) => {
      const cx = Math.floor(x / CONSTELLATION_CONFIG.spatialCellSize);
      const cy = Math.floor(y / CONSTELLATION_CONFIG.spatialCellSize);
      return `${cx}_${cy}`;
    };

    // Resize handler with debouncing and DPR capping
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize particles
      const count = isTouch ? CONSTELLATION_CONFIG.mobileCount : CONSTELLATION_CONFIG.desktopCount;
      particles = Array.from({ length: count }, (_, i) => {
        // 3 Depth layers: 0=Far (faint, small), 1=Mid, 2=Near (bright, big)
        const layer = i % 5 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
        const layerSpeed = layer === 0 ? 0.35 : layer === 1 ? 0.65 : 1.0;
        const vx = (Math.random() - 0.5) * 0.7 * layerSpeed;
        const vy = (Math.random() - 0.5) * 0.7 * layerSpeed;
        const radius = layer === 0 ? Math.random() * 0.5 + 0.9 : layer === 1 ? Math.random() * 0.6 + 1.4 : Math.random() * 0.8 + 2.0;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          r: radius,
          layer,
          isAnchor: layer === 2 && i % 4 === 0,
        };
      });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(document.body);

    // Mouse event handlers
    const onMouseMove = (e: MouseEvent) => {
      if (mouse.prevX === -9999) {
        mouse.prevX = e.clientX;
        mouse.prevY = e.clientY;
      } else {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      }

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastMoveTime = performance.now();

      // Velocity calculation
      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.hypot(dx, dy);

      // Parallax target (moves field a few px opposite mouse)
      parallax.targetX = ((width / 2 - mouse.x) / (width / 2)) * CONSTELLATION_CONFIG.parallaxFactor;
      parallax.targetY = ((height / 2 - mouse.y) / (height / 2)) * CONSTELLATION_CONFIG.parallaxFactor;

      // Shockwave repulsion if moving fast
      if (mouse.speed > CONSTELLATION_CONFIG.shockwaveSpeedThreshold) {
        particles.forEach((p) => {
          const pdx = p.x - mouse.x;
          const pdy = p.y - mouse.y;
          const dist = Math.hypot(pdx, pdy);
          if (dist < CONSTELLATION_CONFIG.mouseRadius && dist > 1) {
            const force = (1 - dist / CONSTELLATION_CONFIG.mouseRadius) * CONSTELLATION_CONFIG.shockwaveForce;
            p.vx += (pdx / dist) * force;
            p.vy += (pdy / dist) * force;
          }
        });
      }
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    // Click ripple & spark burst
    const onMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 10,
        maxR: 140,
        opacity: 0.85,
      });

      // Spawn radial burst of spark particles
      for (let i = 0; i < CONSTELLATION_CONFIG.sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / CONSTELLATION_CONFIG.sparkCount + (Math.random() - 0.5) * 0.4;
        const spd = Math.random() * 5 + 3.5;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0,
          maxLife: 32 + Math.floor(Math.random() * 12),
          r: Math.random() * 1.5 + 1.2,
        });
      }

      // Shockwave push from click point
      particles.forEach((p) => {
        const pdx = p.x - e.clientX;
        const pdy = p.y - e.clientY;
        const dist = Math.hypot(pdx, pdy);
        if (dist < 180 && dist > 1) {
          const force = (1 - dist / 180) * 8.5;
          p.vx += (pdx / dist) * force;
          p.vy += (pdy / dist) * force;
        }
      });
    };

    // Scroll listener for velocity stretch
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollStretch = Math.min(1 + Math.abs(scrollVelocity) * 0.05, CONSTELLATION_CONFIG.maxScrollStretch);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Read colors from CSS variables & lerp over 400ms
    const updateThemeColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      currentTheme.isDark = isDark;

      if (isDark) {
        // Dark mode: neon emerald / green
        currentTheme.targetInk = { r: 236, g: 253, b: 245 };
        currentTheme.targetAccent = { r: 5, g: 223, b: 114 };
      } else {
        // Light mode: warm paper deep ink / vermilion
        currentTheme.targetInk = { r: 17, g: 16, b: 12 };
        currentTheme.targetAccent = { r: 212, g: 56, b: 18 };
      }

      // 400ms smooth interpolation factor
      const lerpSpeed = 0.08;
      currentTheme.ink.r += (currentTheme.targetInk.r - currentTheme.ink.r) * lerpSpeed;
      currentTheme.ink.g += (currentTheme.targetInk.g - currentTheme.ink.g) * lerpSpeed;
      currentTheme.ink.b += (currentTheme.targetInk.b - currentTheme.ink.b) * lerpSpeed;

      currentTheme.accent.r += (currentTheme.targetAccent.r - currentTheme.accent.r) * lerpSpeed;
      currentTheme.accent.g += (currentTheme.targetAccent.g - currentTheme.accent.g) * lerpSpeed;
      currentTheme.accent.b += (currentTheme.targetAccent.b - currentTheme.accent.b) * lerpSpeed;
    };

    // MAIN ANIMATION LOOP
    const render = (time: number) => {
      const frameDelta = time - lastFrameTime;
      lastFrameTime = time;

      // Adaptive degradation if running under 48fps (frame > 21ms)
      if (frameDelta > 21 && particles.length > 40) {
        slowFrames++;
        if (slowFrames > 12) {
          particles.splice(0, 8); // remove a few particles to preserve 60fps
          slowFrames = 0;
        }
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }

      updateThemeColors();

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Dark mode additive bloom
      if (currentTheme.isDark) {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      // Parallax interpolation
      parallax.x += (parallax.targetX - parallax.x) * 0.05;
      parallax.y += (parallax.targetY - parallax.y) * 0.05;

      // Scroll stretch relaxation
      scrollStretch += (1 - scrollStretch) * 0.08;

      const inkRgb = `${Math.round(currentTheme.ink.r)},${Math.round(currentTheme.ink.g)},${Math.round(currentTheme.ink.b)}`;
      const accentRgb = `${Math.round(currentTheme.accent.r)},${Math.round(currentTheme.accent.g)},${Math.round(currentTheme.accent.b)}`;

      // 1. SPOTLIGHT: Reveal subtle micro-grid only near cursor
      if (mouse.active && !prefersReducedMotion) {
        const spotGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          CONSTELLATION_CONFIG.spotlightRadius
        );
        spotGrad.addColorStop(0, `rgba(${accentRgb}, 0.065)`);
        spotGrad.addColorStop(0.5, `rgba(${inkRgb}, 0.02)`);
        spotGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CONSTELLATION_CONFIG.spotlightRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. REBUILD SPATIAL HASH GRID
      spatialGrid.clear();
      particles.forEach((p) => {
        const key = getGridKey(p.x, p.y);
        const cell = spatialGrid.get(key);
        if (cell) cell.push(p);
        else spatialGrid.set(key, [p]);
      });

      // 3. IDLE LIFE: Pulse signals travelling along links when mouse still for >3s
      if (performance.now() - mouse.lastMoveTime > CONSTELLATION_CONFIG.idlePulseDelayMs) {
        if (pulses.length < 3 && Math.random() < 0.03 && particles.length > 2) {
          const randIdx = Math.floor(Math.random() * particles.length);
          const p1 = particles[randIdx];
          // Find a close neighbor
          const neighbors = particles.filter((p) => p !== p1 && Math.hypot(p.x - p1.x, p.y - p1.y) < CONSTELLATION_CONFIG.linkDistance);
          if (neighbors.length > 0) {
            pulses.push({
              p1,
              p2: neighbors[Math.floor(Math.random() * neighbors.length)],
              progress: 0,
            });
          }
        }
      }

      // 4. UPDATE & DRAW PARTICLES WITH PHYSICS
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          // Orbit spring physics near cursor
          if (mouse.active) {
            const pdx = mouse.x - p.x;
            const pdy = mouse.y - p.y;
            const dist = Math.hypot(pdx, pdy);

            if (dist < CONSTELLATION_CONFIG.mouseRadius && dist > 1) {
              // Spring force toward orbit radius (~80px)
              const offset = dist - CONSTELLATION_CONFIG.orbitDistance;
              const force = offset * CONSTELLATION_CONFIG.orbitSpring * (1 - dist / CONSTELLATION_CONFIG.mouseRadius);
              p.vx += (pdx / dist) * force;
              p.vy += (pdy / dist) * force;

              // Tangential swirl velocity
              p.vx += (-pdy / dist) * CONSTELLATION_CONFIG.orbitTangential;
              p.vy += (pdx / dist) * CONSTELLATION_CONFIG.orbitTangential;
            }
          }

          // Velocity damping & cruising recovery
          p.vx = p.vx * CONSTELLATION_CONFIG.damping + p.baseVx * (1 - CONSTELLATION_CONFIG.damping);
          p.vy = p.vy * CONSTELLATION_CONFIG.damping + p.baseVy * (1 - CONSTELLATION_CONFIG.damping);

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Seamless edge wrap
          if (p.x < -20) p.x = width + 20;
          else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          else if (p.y > height + 20) p.y = -20;
        }

        // Parallax shift calculation for depth
        const depthShift = (p.layer + 1) * 0.4;
        const renderX = p.x + parallax.x * depthShift;
        const renderY = p.y + parallax.y * depthShift;

        // Mouse proximity check for halo and glow
        const mDist = mouse.active ? Math.hypot(mouse.x - renderX, mouse.y - renderY) : 9999;
        const isConnectedToMouse = mDist < CONSTELLATION_CONFIG.mouseRadius;

        // Draw particle node
        ctx.beginPath();
        // If scrolling fast, stretch into motion streak
        if (scrollStretch > 1.05) {
          ctx.ellipse(renderX, renderY, p.r, p.r * scrollStretch, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2);
        }

        // Color and opacity by depth layer and mouse proximity
        const baseAlpha = p.layer === 0 ? 0.35 : p.layer === 1 ? 0.6 : 0.9;
        if (isConnectedToMouse) {
          ctx.fillStyle = `rgba(${accentRgb}, 0.95)`;
        } else if (p.isAnchor) {
          ctx.fillStyle = `rgba(${accentRgb}, 0.75)`;
        } else {
          ctx.fillStyle = `rgba(${inkRgb}, ${baseAlpha})`;
        }
        ctx.fill();

        // Connected particle Halo ring + pre-rendered bloom
        if (isConnectedToMouse) {
          const haloAlpha = (1 - mDist / CONSTELLATION_CONFIG.mouseRadius) * 0.75;
          ctx.strokeStyle = `rgba(${accentRgb}, ${haloAlpha.toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.r + CONSTELLATION_CONFIG.haloRadiusOffset, 0, Math.PI * 2);
          ctx.stroke();

          // Stamp offscreen bloom sprite
          ctx.drawImage(bloomCanvas, renderX - 24, renderY - 24);
        }
      });

      // 5. DRAW DELAUNAY-LIKE NEAREST NEIGHBOR CONSTELLATION LINES (Spatial Hash)
      particles.forEach((p) => {
        const renderX1 = p.x + parallax.x * (p.layer + 1) * 0.4;
        const renderY1 = p.y + parallax.y * (p.layer + 1) * 0.4;

        // Inspect 9 neighboring grid cells
        const cx = Math.floor(p.x / CONSTELLATION_CONFIG.spatialCellSize);
        const cy = Math.floor(p.y / CONSTELLATION_CONFIG.spatialCellSize);

        const candidateNeighbors: Array<{ p2: Particle; dist: number }> = [];

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const cell = spatialGrid.get(`${cx + ox}_${cy + oy}`);
            if (!cell) continue;
            for (let k = 0; k < cell.length; k++) {
              const p2 = cell[k];
              if (p2 === p) continue;
              const d = Math.hypot(p.x - p2.x, p.y - p2.y);
              if (d < CONSTELLATION_CONFIG.linkDistance) {
                candidateNeighbors.push({ p2, dist: d });
              }
            }
          }
        }

        // Sort candidates and connect only to 2-3 nearest neighbors for clean constellation feel
        candidateNeighbors.sort((a, b) => a.dist - b.dist);
        const maxLinks = Math.min(candidateNeighbors.length, CONSTELLATION_CONFIG.maxNeighbors);

        for (let j = 0; j < maxLinks; j++) {
          const { p2, dist } = candidateNeighbors[j];
          // Avoid duplicate drawing: only draw if p has lower id or coordinate
          if (p.x < p2.x || (p.x === p2.x && p.y < p2.y)) {
            const renderX2 = p2.x + parallax.x * (p2.layer + 1) * 0.4;
            const renderY2 = p2.y + parallax.y * (p2.layer + 1) * 0.4;

            // Lines fade if mouse is far; brighten when near
            const mDist1 = mouse.active ? Math.hypot(mouse.x - renderX1, mouse.y - renderY1) : 9999;
            const mDist2 = mouse.active ? Math.hypot(mouse.x - renderX2, mouse.y - renderY2) : 9999;
            const isNearActiveMouse = mDist1 < CONSTELLATION_CONFIG.mouseRadius || mDist2 < CONSTELLATION_CONFIG.mouseRadius;

            const baseLineAlpha = (1 - dist / CONSTELLATION_CONFIG.linkDistance) * (isNearActiveMouse ? 0.38 : 0.12);

            ctx.strokeStyle = `rgba(${inkRgb}, ${baseLineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(renderX1, renderY1);
            ctx.lineTo(renderX2, renderY2);
            ctx.stroke();
          }
        }

        // 6. MOUSE HUB NODE GRADIENT CONNECTIONS
        if (mouse.active) {
          const mDist = Math.hypot(mouse.x - renderX1, mouse.y - renderY1);
          if (mDist < CONSTELLATION_CONFIG.mouseRadius) {
            const factor = 1 - mDist / CONSTELLATION_CONFIG.mouseRadius;
            // Gradient from accent at mouse to transparent/particle color at node
            const grad = ctx.createLinearGradient(mouse.x, mouse.y, renderX1, renderY1);
            grad.addColorStop(0, `rgba(${accentRgb}, ${(factor * 0.8).toFixed(2)})`);
            grad.addColorStop(1, `rgba(${accentRgb}, 0.05)`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(renderX1, renderY1);
            ctx.stroke();
          }
        }
      });

      // 7. RENDER IDLE LINE PULSES
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += CONSTELLATION_CONFIG.idlePulseSpeed;

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const px = pulse.p1.x + (pulse.p2.x - pulse.p1.x) * pulse.progress;
        const py = pulse.p1.y + (pulse.p2.y - pulse.p1.y) * pulse.progress;

        ctx.fillStyle = `rgba(${accentRgb}, 0.85)`;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. RENDER CLICK RIPPLES & SPARKS
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 3.8;
        rip.opacity *= 0.94;

        if (rip.r >= rip.maxR || rip.opacity < 0.02) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(${accentRgb}, ${rip.opacity.toFixed(2)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.94;
        sp.vy *= 0.94;

        const progress = sp.life / sp.maxLife;
        if (progress >= 1) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.9;
        ctx.fillStyle = `rgba(${accentRgb}, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    // Pause when tab is hidden or window offscreen
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
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll);
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
