import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGithubProjects, getGithubRepoDetail } from "@/lib/github";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { GithubIcon } from "@/components/SocialIcons";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  GitBranch,
  Star,
  GitFork,
  FileCode,
  ShieldCheck,
  Scale,
  FolderGit2,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getGithubProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getGithubRepoDetail(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} : Repository Overview`,
    description: project.description || `Technical overview and architecture documentation of ${project.name}.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [allProjects, project] = await Promise.all([
    getGithubProjects(),
    getGithubRepoDetail(slug),
  ]);

  if (!project) {
    notFound();
  }

  const currentIndex = allProjects.findIndex(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          prefetch={true}
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded p-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to all projects</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <header className="frosted-section-card p-6 sm:p-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--muted)]">
          <span className="px-2.5 py-1 rounded bg-[var(--surface-card)] border border-[var(--line-subtle)] text-[var(--accent)] font-semibold">
            {project.language}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Created {project.createdAt}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified GitHub Repository</span>
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {project.name}
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed font-sans max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--line)]">
          {/* Direct GitHub Button */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#181717] text-white hover:bg-[#24292F] dark:bg-white dark:text-[#181717] dark:hover:bg-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shadow-sm"
            aria-label={`Open ${project.name} on GitHub`}
          >
            <GithubIcon className="w-4 h-4" />
            <span>Open in GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Live Preview Button (If available) */}
          {hasLiveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>Live deployment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {/* Technical Specifications Matrix */}
      <section className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold flex items-center gap-2">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Repository Specifications</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-card)] space-y-1">
            <span className="text-[var(--muted)] flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Language</span>
            </span>
            <p className="font-bold text-[var(--ink)] text-sm">{project.language}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-card)] space-y-1">
            <span className="text-[var(--muted)] flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Branch</span>
            </span>
            <p className="font-bold text-[var(--ink)] text-sm">{project.defaultBranch}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-card)] space-y-1">
            <span className="text-[var(--muted)] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>License</span>
            </span>
            <p className="font-bold text-[var(--ink)] text-sm truncate">{project.license}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-card)] space-y-1">
            <span className="text-[var(--muted)] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Engagement</span>
            </span>
            <p className="font-bold text-[var(--ink)] text-sm">
              {project.stars} stars • {project.forks} forks
            </p>
          </div>
        </div>
      </section>

      {/* Live README & Documentation */}
      <section className="frosted-section-card p-6 sm:p-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
              DOCUMENTATION // README.md
            </span>
          </div>
          <a
            href={`${project.githubUrl}/blob/${project.defaultBranch}/README.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
          >
            <span>Raw source</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div className="readme-container">
          <MarkdownRenderer content={project.readmeContent} />
        </div>
      </section>

      {/* Adjacent Project Navigation */}
      <nav aria-label="Adjacent projects" className="pt-8 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            prefetch={true}
            className="p-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors group flex items-center gap-3"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-colors" />
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                Previous repository
              </span>
              <p className="font-mono text-sm font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">
                {prevProject.name}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            href={`/projects/${nextProject.slug}`}
            prefetch={true}
            className="p-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors group flex items-center justify-between gap-3 text-right"
          >
            <div className="overflow-hidden ml-auto">
              <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                Next repository
              </span>
              <p className="font-mono text-sm font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">
                {nextProject.name}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-colors" />
          </Link>
        )}
      </nav>
    </div>
  );
}
