"use client";

import { useState } from "react";
import { GithubProject } from "@/lib/github";
import { GithubProjectCard } from "@/components/GithubProjectCard";
import { Layers } from "lucide-react";

export function ProjectsClient({ projects }: { projects: GithubProject[] }) {
  const [activeLanguage, setActiveLanguage] = useState("All");

  const languages = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean))),
  ];

  const filteredProjects =
    activeLanguage === "All"
      ? projects
      : projects.filter((p) => p.language === activeLanguage);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Language:</span>
          </span>
          {languages.map((lang) => {
            const isActive = activeLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLanguage(lang)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  isActive
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-xs"
                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[var(--muted)]">
          Showing <strong className="text-[var(--ink)]">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? "repository" : "repositories"}
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <GithubProjectCard key={project.slug} project={project} index={idx} />
          ))
        ) : (
          <div className="p-12 border border-dashed border-[var(--line)] rounded-2xl text-center space-y-2">
            <p className="font-mono text-sm font-semibold text-[var(--ink)]">
              No repositories found under this filter.
            </p>
            <p className="font-mono text-xs text-[var(--muted)]">
              Switch back to &quot;All&quot; to inspect all synchronized projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
