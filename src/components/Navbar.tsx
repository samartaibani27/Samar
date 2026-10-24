"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/profile";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  // Handle escape key and scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
          openButtonRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !menuRef.current) return;
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener("keydown", handleTab);
      return () => window.removeEventListener("keydown", handleTab);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-3 left-3 z-[100] px-4 py-2 bg-[var(--accent-fill)] text-[var(--accent-foreground)] font-mono text-xs font-semibold rounded shadow-md"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b border-[var(--line)] ${
          scrolled
            ? "bg-[var(--bg)]/90 backdrop-blur-md py-3 shadow-xs"
            : "bg-[var(--bg)]/70 backdrop-blur-md py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav
            aria-label="Main navigation"
            className="flex items-center justify-between"
          >
            {/* Logo mark and name */}
            <Link
              href="/"
              className="flex items-center gap-3 text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded p-1"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded border border-[var(--line)] bg-[var(--surface)] font-mono font-bold text-xs text-[var(--accent)]">
                {profile.initials}
              </span>
              <span className="font-semibold text-sm tracking-tight hidden sm:inline">
                {profile.name}
              </span>
            </Link>

            {/* Desktop Center Links */}
            <div className="hidden md:flex items-center gap-1 border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 rounded-full shadow-xs">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link-underline px-3.5 py-1 text-xs font-mono tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isActive
                        ? "text-[var(--accent)] font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side: Available pill, Theme toggle, Let's Talk CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                aria-label="Availability status: Available for work"
                className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[11px] font-mono text-[var(--muted)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span>Available</span>
              </div>

              <ThemeToggle />

              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold btn-pill-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shadow-xs"
              >
                <span>Let&#39;s Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              {/* Mobile menu button */}
              <button
                ref={openButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[var(--bg)] p-6 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-mono font-bold text-sm text-[var(--text)]"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] text-xs">
                {profile.initials}
              </span>
              <span>{profile.name}</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded border border-[var(--line)] text-[var(--text)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 py-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-bold tracking-tight transition-colors ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--line)] pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--text-muted)]">Theme mode</span>
              <ThemeToggle />
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded text-sm font-mono font-semibold bg-[var(--accent-fill)] text-[var(--accent-foreground)] hover:bg-[var(--accent-fill-hover)] transition-colors"
            >
              <span>Let&#39;s Talk</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
