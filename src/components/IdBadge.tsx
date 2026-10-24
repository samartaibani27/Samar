"use client";

import { useState, useRef, KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { ShieldCheck, Cpu } from "lucide-react";

export function IdBadge() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Only apply tilt on desktop pointer devices
    if (!cardRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Mild tilt: +/- 6 degrees max
    setRotate({
      x: -y * 0.03,
      y: x * 0.03,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Lanyard Top Strap & Clip */}
      <div className="flex flex-col items-center z-10 pointer-events-none" aria-hidden="true">
        <div className="w-5 h-8 bg-[var(--surface-card)] border-x border-[var(--line)] shadow-inner" />
        <div className="w-9 h-2.5 bg-[var(--line)] rounded-t border border-[var(--line-subtle)]" />
        <div className="w-3 h-4 bg-[var(--surface-hover)] rounded-sm border border-[var(--line)] -mt-0.5" />
      </div>

      {/* Perspective Container */}
      <div
        ref={cardRef}
        className="perspective-1000 -mt-1 cursor-pointer select-none"
        tabIndex={0}
        role="button"
        aria-label={`Identification badge for ${profile.name}. Press enter or space to flip.`}
        aria-pressed={isFlipped}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="preserve-3d relative w-[290px] sm:w-[330px] h-[540px] sm:h-[580px] rounded-2xl shadow-xl transition-transform duration-500 ease-out"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ────── FRONT SIDE ────── */}
          <div className="backface-hidden absolute inset-0 w-full h-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
            {/* Top Lanyard & Header */}
            <div className="space-y-2.5">
              {/* Lanyard slot hole */}
              <div className="w-12 h-3 mx-auto bg-[var(--bg)] rounded-full border border-[var(--line)]" />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] border-b border-[var(--line)] pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  PORTFOLIO // ID
                </span>
                <span className="text-[var(--accent)] font-semibold">{profile.location}</span>
              </div>
            </div>

            {/* Profile Photo - Full portrait uncropped at native 3:4 aspect ratio */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface-card)] flex items-center justify-center">
              {profile.photoUrl && !imageError ? (
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  sizes="(max-width: 640px) 290px, 330px"
                  className="object-cover object-center"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--surface-card)] text-[var(--text)]">
                  <span className="font-mono text-4xl font-extrabold text-[var(--accent)]">
                    {profile.initials}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-2">
                    Verified Identity
                  </span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[var(--bg)]/90 border border-[var(--line)] text-[10px] font-mono text-[var(--accent)]">
                {profile.status}
              </div>
            </div>

            {/* Identity Info */}
            <div className="space-y-0.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                Student and Developer
              </p>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
                {profile.name}
              </h2>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Web Systems Engineering
              </p>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-2.5 text-[10px] font-mono text-[var(--text-muted)]">
              <span>ACTIVE: 2026</span>
              <span className="text-[var(--accent)]">TAP TO FLIP ↻</span>
            </div>
          </div>

          {/* ────── BACK SIDE ────── */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
            {/* Top Lanyard & Header */}
            <div className="space-y-2">
              {/* Lanyard slot hole */}
              <div className="w-12 h-2.5 mx-auto bg-[var(--bg)] rounded-full border border-[var(--line)]" />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] border-b border-[var(--line)] pb-2">
                <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                  <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                  TECHNICAL CORE
                </span>
                <span className="text-[var(--text-muted)]">SPEC // 01</span>
              </div>
            </div>

            {/* Developer Identity & Summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                Developer Profile
              </span>
              <h3 className="text-base font-bold tracking-tight text-[var(--text)] font-sans">
                {profile.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {profile.technicalCoreSummary}
              </p>
            </div>

            {/* Core Tech Stack Strip */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                <span>Core Toolchain</span>
                <span className="text-[var(--accent)]">Production</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs", "SQL", "Git"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--line-subtle)] bg-[var(--surface)] text-[var(--text)] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="space-y-1 border-t border-[var(--line)] pt-2 text-[11px] font-mono">
              <div className="flex justify-between py-1 border-b border-[var(--line-subtle)]">
                <span className="text-[var(--text-muted)]">Architecture:</span>
                <span className="text-[var(--text)] font-medium">Full-Stack Web</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line-subtle)]">
                <span className="text-[var(--text-muted)]">Education:</span>
                <span className="text-[var(--text)] font-medium">BCA (2026) • MCA Scholar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line-subtle)]">
                <span className="text-[var(--text-muted)]">Standards:</span>
                <span className="text-[var(--text)] font-medium">WCAG 2.1 AA &amp; Clean Code</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line-subtle)]">
                <span className="text-[var(--text-muted)]">Timezone:</span>
                <span className="text-[var(--text)] font-medium">India (IST, UTC+5:30)</span>
              </div>
            </div>

            {/* Mechanical Barcode & Security Strip */}
            <div className="space-y-2 border-t border-[var(--line)] pt-2">
              {/* Authentic SVG Barcode */}
              <div className="flex items-center justify-between gap-1 h-5 px-1 opacity-70" aria-hidden="true">
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1.5 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-2 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1 h-full bg-[var(--ink)]" />
                <div className="w-1.5 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-2 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1.5 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-2 h-full bg-[var(--ink)]" />
                <div className="w-1 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
                <div className="w-1.5 h-full bg-[var(--ink)]" />
                <div className="w-0.5 h-full bg-[var(--ink)]" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1 text-[var(--accent)]">
                  <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                  STATUS: VERIFIED
                </span>
                <span className="text-[var(--accent)] font-semibold">TAP TO RETURN ↻</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
        [ Tap or press Enter to flip ]
      </p>
    </div>
  );
}
