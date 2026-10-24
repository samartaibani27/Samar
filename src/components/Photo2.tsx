"use client";

import Image from "next/image";
import { profile } from "@/data/profile";
import { Image as ImageIcon, Sparkles } from "lucide-react";

interface Photo2Props {
  className?: string;
  priority?: boolean;
}

export function Photo2({ className = "", priority = false }: Photo2Props) {
  const hasPhoto2 = Boolean(profile.photo2Url && profile.photo2Url.trim().length > 0);

  return (
    <div
      className={`relative w-full aspect-square sm:aspect-[4/5] max-w-[380px] mx-auto rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface-card)] shadow-md flex items-center justify-center ${className}`}
      data-component="Photo2"
    >
      {hasPhoto2 ? (
        <>
          <Image
            src={profile.photo2Url}
            alt={`Portrait of ${profile.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
            priority={priority}
          />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[var(--bg)]/90 backdrop-blur-xs border border-[var(--line)] text-[10px] font-mono text-[var(--accent)] font-semibold shadow-xs">
            TS // DEV
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 w-full h-full border-2 border-dashed border-[var(--line)] rounded-2xl bg-[var(--surface)]/50">
          <div className="w-12 h-12 rounded-xl bg-[var(--surface-card)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shadow-xs">
            <ImageIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Photo 2 Slot</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Ready for secondary portrait
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--surface-card)] text-[var(--text-muted)]">
            component: Photo2
          </span>
        </div>
      )}
    </div>
  );
}
