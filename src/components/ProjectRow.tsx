"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/data/profile";
import { isTodo, getSafeText } from "@/lib/profile-utils";
import { ExternalLink, ArrowRight, ChevronDown } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const hasLiveUrl = !isTodo(project.liveUrl);
  const hasGithubUrl = !isTodo(project.githubUrl);
  const safeDescription = getSafeText(project.description, "Project details and architecture.");

  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      className="card-lift rounded-lg overflow-hidden"
      aria-label={`Project: ${project.title}`}
    >
      <div
        className="p-5 sm:p-6 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="font-mono text-xs font-bold text-[var(--accent)] pt-1">
              {formattedIndex}
            </span>
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-lg sm:text-xl font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                >
                  {project.title}
                </Link>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--line-subtle)]">
                  {project.category}
                </span>
              </div>
              {safeDescription && (
                <p className="text-sm text-[var(--text-muted)] mt-1.5 line-clamp-2 max-w-2xl font-sans">
                  {safeDescription}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {project.year}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded btn-slide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={`Read case study for ${project.title}`}
              >
                <span>Overview</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
                className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse project details" : "Expand project details"}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""
                    }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Tech and Links Drawer */}
        {expanded && (
          <div className="mt-5 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--surface-card)] border border-[var(--line-subtle)] text-[var(--text-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {hasGithubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <GithubIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Repository</span>
                </a>
              )}
              {hasLiveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Live preview</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
