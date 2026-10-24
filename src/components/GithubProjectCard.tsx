"use client";

import Link from "next/link";
import { GithubProject } from "@/lib/github";
import { GithubIcon } from "@/components/SocialIcons";
import { ArrowRight, Calendar, Code2, Star, GitFork, ArrowUpRight } from "lucide-react";

interface GithubProjectCardProps {
  project: GithubProject;
  index: number;
}

export function GithubProjectCard({ project, index }: GithubProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");
  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim().length > 0);

  return (
    <article
      className="frosted-section-card p-6 sm:p-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-subtle)] transition-all duration-200 space-y-6 relative overflow-hidden group"
      aria-label={`Repository: ${project.name}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--line-subtle)]">
            REPO // {formattedIndex}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)]">
            <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
            <span>{project.language}</span>
          </span>
        </div>

        {/* Date / Metadata Info */}
        <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Updated: {project.updatedAt}</span>
          </span>
          {project.stars > 0 && (
            <span className="flex items-center gap-1 text-[var(--ink)]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{project.stars}</span>
            </span>
          )}
          {project.forks > 0 && (
            <span className="flex items-center gap-1 text-[var(--muted)]">
              <GitFork className="w-3.5 h-3.5" />
              <span>{project.forks}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Overview */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
          <Link href={`/projects/${project.slug}`} prefetch={true} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded">
            {project.name}
          </Link>
        </h2>

        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed font-sans max-w-3xl line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Topics / Tags */}
      {project.topics && project.topics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {project.topics.map((topic) => (
            <span
              key={topic}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-[var(--line)] bg-[var(--surface-card)] text-[var(--muted)]"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Action Row */}
      <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Overview button with prefetching for sub-second page transitions */}
          <Link
            href={`/projects/${project.slug}`}
            prefetch={true}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shadow-sm"
            aria-label={`View full overview of ${project.name}`}
          >
            <span>Overview &amp; README</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>

          {/* Direct GitHub Repository Button */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-medium border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[#181717] hover:text-white hover:border-[#181717] dark:hover:bg-white dark:hover:text-[#181717] dark:hover:border-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label={`View ${project.name} repository on GitHub`}
            title="Open repository on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Repository</span>
          </a>
        </div>

        {/* Live Preview Button (If configured on GitHub) */}
        {hasLiveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <span>Live preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
