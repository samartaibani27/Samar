"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "collaboration", label: "Contact" },
];

export function SideNav() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Section shortcuts"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3.5"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeId === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollTo(sec.id)}
            aria-label={`Jump to ${sec.label}`}
            className="group relative flex items-center justify-center p-1 cursor-pointer focus-visible:outline-none"
          >
            {/* Tooltip on hover */}
            <span className="absolute right-6 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[var(--ink)] text-[var(--bg)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-sm">
              {sec.label}
            </span>

            {/* Dot Indicator */}
            <span
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? "w-2.5 h-2.5 bg-[var(--ink)] scale-110 shadow-sm"
                  : "w-1.5 h-1.5 bg-[var(--ink)]/40 hover:bg-[var(--ink)]/80 hover:scale-125"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
