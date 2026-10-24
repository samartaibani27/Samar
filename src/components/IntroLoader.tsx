"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

export function IntroLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // Check if played this session
    const hasPlayed = sessionStorage.getItem("samar_intro_seen");
    if (hasPlayed) {
      return;
    }

    let frameId: number;

    const timer = setTimeout(() => {
      setVisible(true);

      const startTime = performance.now();
      const duration = 1400; // ~1.4 seconds

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
        setProgress(pct);

        if (elapsed < duration) {
          frameId = requestAnimationFrame(tick);
        } else {
          setTimeout(() => {
            sessionStorage.setItem("samar_intro_seen", "true");
            setVisible(false);
          }, 200);
        }
      };

      frameId = requestAnimationFrame(tick);
    }, 10);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("samar_intro_seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[var(--bg)] text-[var(--text)] p-6 sm:p-12 transition-opacity duration-300 pointer-events-auto"
      role="dialog"
      aria-label="Portfolio introductory loading screen"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          DEVELOPER ARCHIVE: 2026
        </span>
        <button
          type="button"
          onClick={handleSkip}
          className="font-mono text-xs tracking-wider text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--line)] hover:border-[var(--accent)] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
          aria-label="Skip introduction animation"
        >
          [ Skip intro ]
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full text-center my-auto">
        <p className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-3">
          PORTFOLIO INITIALIZATION
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text)]">
          {profile.name}
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mt-4">
          Systems and web applications
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
          <span>SYSTEM READY</span>
          <span className="tabular-nums font-semibold text-[var(--accent)]">{progress}%</span>
        </div>
        <div className="w-full h-1 bg-[var(--line)] rounded overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
