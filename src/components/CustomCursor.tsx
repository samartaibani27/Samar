"use client";

import { useEffect, useRef, useState, RefObject } from "react";

/**
 * MAGNETIC HOOK: Pulls buttons/elements toward cursor up to maxDistance px
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(maxDistance = 8): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < rect.width * 1.1) {
        const pullFactor = (1 - dist / (rect.width * 1.1)) * maxDistance;
        const tx = (dx / (dist || 1)) * pullFactor;
        const ty = (dy / (dist || 1)) * pullFactor;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      } else {
        el.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const onMouseLeave = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.style.transform = "";
    };
  }, [maxDistance]);

  return ref;
}

/**
 * CustomCursor: Section 5A Specification
 * - 10px solid diamond rotated 45deg in --accent following mouse exactly
 * - Thin 1px ring (~30px) following with lerp 0.15, expanding to ~50px over links/buttons
 * - Hidden on touch devices (@media (hover: none))
 * - Native cursor preserved in inputs/textareas
 */
export function CustomCursor() {
  const diamondRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isInteractive, setIsInteractive] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Hide completely on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    let rafId: number;
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let visible = false;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (!visible) {
        rx = mx;
        ry = my;
        visible = true;
      }

      const target = e.target as HTMLElement | null;
      const inputEl = !!target?.closest("input, textarea, select, [contenteditable='true']");
      const interactiveEl = !inputEl && !!target?.closest("a, button, [role='button'], .cursor-pointer, [data-cursor]");

      setIsInput(inputEl);
      setIsInteractive(interactiveEl);

      if (diamondRef.current) {
        diamondRef.current.style.opacity = inputEl ? "0" : "1";
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = inputEl ? "0" : "1";
      }
    };

    const onMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const onMouseLeave = () => {
      visible = false;
      if (diamondRef.current) diamondRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    // Render loop: instant diamond + lerp ring (0.15)
    const render = () => {
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.15;
      ry += dy * 0.15;

      // 1. Instant 10px Diamond rotated 45deg
      if (diamondRef.current) {
        diamondRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) rotate(45deg)`;
      }

      // 2. Trailing 1px Ring (~30px base, grows to ~50px on interactive elements)
      if (ringRef.current) {
        const ringScale = isMouseDownRef.current ? 0.75 : 1;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* 10px Solid Diamond in --accent: Follows mouse exactly */}
      <div
        ref={diamondRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[var(--accent)] pointer-events-none z-[9999] opacity-0 will-change-transform shadow-xs"
        style={{ width: "10px", height: "10px" }}
      />

      {/* Thin 1px Ring in --accent: Follows with lerp 0.15, expands from 30px to 50px over links/buttons */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9998] opacity-0 will-change-transform rounded-full border border-[var(--accent)] transition-[width,height,background-color,opacity] duration-200 ease-out ${
          isInput
            ? "!opacity-0"
            : isInteractive
            ? "w-[50px] h-[50px] bg-[var(--accent)]/15 backdrop-blur-[0.5px]"
            : "w-[30px] h-[30px] bg-transparent"
        }`}
      />
    </>
  );
}
