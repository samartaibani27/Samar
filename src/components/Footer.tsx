"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, InstagramIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { profile } from "@/data/profile";
import { ArrowUp, Mail } from "lucide-react";

export function Footer() {
  const [time, setTime] = useState<string>("");
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentYear(now.getFullYear());
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: profile.timezone || "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md text-[var(--muted)] mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8">
        {/* ────── MAIN COMPACT FOOTER ROW ────── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-6 border-b border-[var(--line)]">
          {/* Brand & Identity */}
          <div className="space-y-2 max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-mono font-bold text-sm text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] text-xs font-mono font-bold">
                {profile.initials}
              </span>
              <span>{profile.name}</span>
            </Link>

            <p className="font-mono text-xs text-[var(--text-muted)]">
              {profile.fullName}
            </p>

            <div className="inline-flex items-center gap-2 pt-1 text-xs font-mono text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gujarat, India</span>
              <span className="text-[var(--line)]">|</span>
              <span className="tabular-nums font-semibold text-[var(--ink)]">
                {time || "Loading..."}
              </span>
            </div>
          </div>

          {/* Compact Navigation */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Pages
            </span>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono">
              <Link
                href="/"
                className="hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Direct Connect & Social Icons with Brand Colors */}
          <div className="space-y-2 md:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Connect
            </span>
            <div className="flex flex-wrap md:justify-end items-center gap-2">
              {/* GitHub - Solid Black/Charcoal in Light Mode, Crisp White in Dark Mode */}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#24292F]/30 bg-[#24292F]/10 text-[#24292F] hover:bg-[#24292F] hover:text-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-[#181717] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#24292F]"
                aria-label="GitHub profile"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" aria-hidden="true" />
              </a>

              {/* LinkedIn - Blue (#0A66C2) */}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#0A66C2]/30 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white dark:border-[#0A66C2]/40 dark:bg-[#0A66C2]/20 dark:text-[#388CDD] dark:hover:bg-[#0A66C2] dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0A66C2]"
                aria-label="LinkedIn profile"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {/* Instagram - Brand Pink/Rose (#E4405F) */}
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#E4405F]/30 bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white dark:border-[#E4405F]/40 dark:bg-[#E4405F]/20 dark:text-[#FA587A] dark:hover:bg-[#E4405F] dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E4405F]"
                aria-label="Instagram profile"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {/* Email - Brand Red (#EA4335) */}
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#EA4335]/30 bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335] hover:text-white dark:border-[#EA4335]/40 dark:bg-[#EA4335]/20 dark:text-[#FF6D5D] dark:hover:bg-[#EA4335] dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EA4335]"
                aria-label="Send email"
                title="Email"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {/* WhatsApp - Brand Green (#25D366) */}
              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white dark:border-[#25D366]/40 dark:bg-[#25D366]/20 dark:text-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
                aria-label="WhatsApp chat"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* ────── BOTTOM BAR ────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)]">
          <p>© {currentYear} {profile.fullName}. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Privacy policy
            </Link>
            <span className="text-[var(--line)]">|</span>
            <Link
              href="/terms"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Terms and conditions
            </Link>
            <span className="text-[var(--line)]">|</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors cursor-pointer"
              aria-label="Scroll to top of page"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
