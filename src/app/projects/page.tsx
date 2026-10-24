import type { Metadata } from "next";
import { getGithubProjects } from "@/lib/github";
import { ProjectsClient } from "@/components/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "Live synchronized software engineering projects, open-source repositories, and web applications by Taibani Samar.",
};


export default async function ProjectsPage() {
  const projects = await getGithubProjects();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24">
      <section className="frosted-section-card p-6 sm:p-10 lg:p-12 reveal relative overflow-hidden">
        <div className="relative z-10 space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                CATALOG // ARCHIVE
              </span>
              <span className="h-px w-10 bg-[var(--line)]" />
            </div>
            <h1 className="heading-fluid-lg font-bold tracking-tight text-[var(--ink)]">
              Software projects
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed font-sans">
              Live synchronized collection of open-source repositories, web applications, and services from GitHub. Click any project to inspect its architecture, live deployment, or complete README documentation.
            </p>
          </div>

          {/* Interactive filterable projects */}
          <ProjectsClient projects={projects} />
        </div>
      </section>
    </div>
  );
}
