import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";
import { getSafeText } from "@/lib/profile-utils";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { SkillsGrid } from "@/components/SkillsGrid";
import {
  MapPin,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Background, technical journey, academic background, and skills profile of Taibani Samar.",
};

export default function AboutPage() {
  const safeBio = getSafeText(
    profile.aboutMe,
    "Full-stack web developer and computer applications student based in Gujarat, India. Focused on building dependable web applications, typed APIs, clean database designs, and accessible user interfaces."
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24 space-y-12 sm:space-y-16">
      {/* ────── 1. ABOUT SAMAR TAIBANI WITH PORTRAIT PHOTO ────── */}
      <section className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden" aria-labelledby="bio-heading">
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                BACKGROUND // PROFILE
              </span>
              <span className="h-px w-10 bg-[var(--line)]" />
            </div>
            <h1 id="bio-heading" className="heading-fluid-lg font-bold tracking-tight text-[var(--ink)]">
              About {profile.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-[var(--muted)]">
              {profile.role}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Full Portrait Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface-card)] shadow-lg">
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 340px"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg)]/90 backdrop-blur-xs border border-[var(--line)] text-xs font-mono">
                  <div className="flex items-center gap-2 text-[var(--accent)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{profile.status}</span>
                  </div>
                  <span className="text-[var(--text)] font-semibold truncate text-[11px]">
                    {profile.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative about Samar Taibani */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed font-sans">
                  {safeBio}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
                  My academic journey includes graduating with a Bachelor of Computer Applications from Veer Narmad South Gujarat University (2023 to 2026), and continuing into advanced computer applications through my Master of Computer Applications at Uka Tarsadia University (started in 2026).
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
                  Working as a full-stack developer, my focus is on writing maintainable, clean code that prioritizes performance, security, and web accessibility across end-to-end architectures.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[var(--line)]">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] font-mono text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Contact me</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] font-mono text-xs font-medium hover:border-[var(--line-subtle)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <span>View projects</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── 2. QUICK FACTS CARD (DETAILS ONLY) ────── */}
      <section className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden" aria-labelledby="quick-facts-heading">
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                VERIFIED IDENTITY & DETAILS
              </span>
            </div>
            <h2 id="quick-facts-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              Quick facts and contact
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-xl font-sans">
              Direct contact coordinates, academic standing, and current operational details.
            </p>
          </div>

          {/* Quick Facts List */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Identity specifications
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                TS // ID
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Full name</span>
                </div>
                <p className="text-base font-bold text-[var(--text)] tracking-tight">
                  {profile.fullName}
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Location</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {profile.location}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Current status</span>
                </div>
                <p className="text-sm font-semibold text-[var(--accent)]">
                  {profile.status}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Academic background</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text)] leading-snug">
                  BCA Graduate (2026)
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  MCA Scholar (Pursuing)
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Timezone</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  India (IST, UTC+5:30)
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Email address</span>
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors inline-block break-all"
                >
                  {profile.email}
                </a>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-card)] space-y-1 sm:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Mobile number</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                    className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  >
                    {profile.phone}
                  </a>
                  <span className="text-[var(--line)]">|</span>
                  <a
                    href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Chat on WhatsApp</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── 3. JOURNEY TIMELINE (EXPERIENCE & EDUCATION) ────── */}
      <section className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden" aria-labelledby="journey-heading">
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                ACADEMIC & TECHNICAL MILESTONES
              </span>
            </div>
            <h2 id="journey-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              Education and milestones
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-xl font-sans">
              Formal academic qualifications and computer applications degrees in progress.
            </p>
          </div>

          <JourneyTimeline />
        </div>
      </section>

      {/* ────── 4. SKILLS GROUPED BY LAYER ────── */}
      <section className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden" aria-labelledby="skills-heading">
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              TECHNICAL CAPABILITIES
            </span>
            <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              Skills by architectural layer
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-xl font-sans">
              Tools and technologies utilized across frontend, backend, database, and dev tooling.
            </p>
          </div>

          <SkillsGrid />
        </div>
      </section>
    </div>
  );
}
