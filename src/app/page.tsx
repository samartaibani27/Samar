import Link from "next/link";
import { profile } from "@/data/profile";
import { getSafeText } from "@/lib/profile-utils";
import { IdBadge } from "@/components/IdBadge";
import { Marquee } from "@/components/Marquee";
import { ServicesSection } from "@/components/ServicesSection";
import { GithubProjectCard } from "@/components/GithubProjectCard";
import { TextScramble } from "@/components/TextScramble";
import { ArrowRight, ArrowUpRight, FolderGit2 } from "lucide-react";
import { getGithubProjects } from "@/lib/github";

export default async function HomePage() {
  const safeRole = getSafeText(profile.role, "Full-Stack Web Developer");
  const safeTagline = getSafeText(
    profile.tagline,
    "Developing modern web applications with responsive interfaces, typed backend architectures, and clean software design."
  );
  const hasResume = profile.resumeUrl && profile.resumeUrl.trim().length > 0;
  const liveProjects = await getGithubProjects();
  const featuredProjects = liveProjects.slice(0, 3);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pt-24 sm:pt-28 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto w-full">
      {/* ────── HERO SECTION (FROSTED CARD) ────── */}
      <section
        id="hero"
        className="frosted-section-card p-6 sm:p-12 lg:p-16 reveal relative overflow-hidden"
        aria-label="Hero overview"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-mono text-[var(--muted)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span>Status: {profile.status}</span>
              <span className="text-[var(--line)]">•</span>
              <span>{profile.location}</span>
            </div>

            {/* Large Headline with Hover Text-Scramble Effect */}
            <h1 className="heading-fluid-xl font-bold tracking-tight text-[var(--ink)] leading-[1.08]">
              <TextScramble
                text={profile.name}
                dataCursor="link"
                dataCursorLabel="Profile"
              />
              {safeRole && (
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-[var(--muted)] mt-2 font-normal font-sans">
                  {safeRole}
                </span>
              )}
            </h1>

            {/* Tagline / Intro */}
            <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl leading-relaxed font-sans">
              {safeTagline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                data-cursor="link"
                data-cursor-label="Projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-mono font-semibold btn-slide-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <FolderGit2 className="w-4 h-4" aria-hidden="true" />
                <span>View projects</span>
              </Link>

              {hasResume && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  data-cursor-label="PDF"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-mono btn-slide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>Download resume</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )}

              <Link
                href="/contact"
                data-cursor="link"
                data-cursor-label="Chat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-mono btn-slide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span>Contact us</span>
              </Link>
            </div>

            {/* Quick Spec Strip */}
            <div className="pt-6 border-t border-[var(--line)] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono text-[var(--muted)]">
              <div>
                <span className="block text-[10px] text-[var(--muted)] uppercase tracking-wider">
                  Discipline
                </span>
                <span className="text-[var(--ink)] font-medium">Software Engineering</span>
              </div>
              <div>
                <span className="block text-[10px] text-[var(--muted)] uppercase tracking-wider">
                  Education
                </span>
                <span className="text-[var(--ink)] font-medium">{profile.status}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[var(--muted)] uppercase tracking-wider">
                  Timezone
                </span>
                <span className="text-[var(--ink)] font-medium">India (IST)</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Flip ID Badge Card */}
          <div className="lg:col-span-5 flex justify-center" data-cursor="link" data-cursor-label="Flip">
            <IdBadge />
          </div>
        </div>
      </section>

      {/* ────── RUNNING MARQUEE RIBBON ────── */}
      <div className="rounded-xl overflow-hidden border border-[var(--line)]">
        <Marquee />
      </div>

      {/* ────── FEATURED PROJECTS SECTION (FROSTED CARD) ────── */}
      <section
        id="projects"
        className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden"
        aria-labelledby="featured-projects-heading"
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-[var(--line)]">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                  01 // SELECTED WORK
                </span>
                <span className="h-px w-8 bg-[var(--line)]" />
              </div>
              <h2 id="featured-projects-heading" className="heading-fluid-lg font-bold tracking-tight text-[var(--ink)]">
                <TextScramble text="Featured software projects" />
              </h2>
            </div>

            <Link
              href="/projects"
              data-cursor="link"
              data-cursor-label="Archive"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent)] nav-link-underline"
            >
              <span>View all projects</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-6">
            {featuredProjects.map((project, idx) => (
              <GithubProjectCard key={project.slug} project={project} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ────── SERVICES SECTION (FROSTED CARD) ────── */}
      <div id="services" className="reveal">
        <ServicesSection />
      </div>

      {/* ────── CALL TO ACTION SECTION (FROSTED CARD) ────── */}
      <section
        id="collaboration"
        className="frosted-section-card p-8 sm:p-12 reveal relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
              03 // COLLABORATION
            </span>
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              <TextScramble text="Have a project or internship opening?" />
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
              I am currently open to engineering conversations, internships, and collaborative software projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              data-cursor="link"
              data-cursor-label="Chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-mono font-semibold btn-slide-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span>Let&#39;s talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              data-cursor="link"
              data-cursor-label="Story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-mono btn-slide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span>Read background</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
