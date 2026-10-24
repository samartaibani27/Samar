export interface GithubProject {
  slug: string;
  name: string;
  description: string;
  language: string;
  topics: string[];
  githubUrl: string;
  liveUrl: string;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  defaultBranch: string;
  size: number;
  license: string;
  openIssues: number;
}

export interface GithubRepoDetail extends GithubProject {
  readmeContent: string;
}

const GITHUB_USERNAME = "samartaibani27";

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SamarTaibani-Portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

/**
 * Fetches all public repositories for samartaibani27 with Next.js ISR (60s revalidation).
 */
export async function getGithubProjects(): Promise<GithubProject[]> {
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status} for ${url}`);
      return getFallbackProjects();
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      return getFallbackProjects();
    }

    // Filter out forks so only Samar's own repositories are displayed
    const ownedRepos = repos.filter((r) => !r.fork);

    return ownedRepos.map((repo: any) => ({
      slug: repo.name,
      name: repo.name,
      description:
        repo.description && repo.description.trim().length > 0
          ? repo.description.trim()
          : "Full-stack software engineering project and repository on GitHub.",
      language: repo.language || "TypeScript",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      githubUrl: repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
      liveUrl: repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage.trim() : "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      createdAt: formatDate(repo.created_at || new Date().toISOString()),
      updatedAt: formatDate(repo.pushed_at || repo.updated_at || new Date().toISOString()),
      defaultBranch: repo.default_branch || "main",
      size: repo.size || 0,
      license: repo.license?.name || "Open Source",
      openIssues: repo.open_issues_count || 0,
    }));
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return getFallbackProjects();
  }
}

/**
 * Fetches full detail for a single repository including decoded README.
 */
export async function getGithubRepoDetail(slug: string): Promise<GithubRepoDetail | null> {
  try {
    const projects = await getGithubProjects();
    const project = projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

    if (!project) {
      return null;
    }

    let readmeContent = "";
    try {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${project.name}/readme`,
        {
          headers: getAuthHeaders(),
          next: { revalidate: 60 },
        }
      );

      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData?.content && readmeData.encoding === "base64") {
          readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        }
      }
    } catch (readmeErr) {
      console.warn(`Could not load README for ${slug}:`, readmeErr);
    }

    return {
      ...project,
      readmeContent: readmeContent.trim(),
    };
  } catch (error) {
    console.error(`Error fetching repo detail for ${slug}:`, error);
    return null;
  }
}

/**
 * Safe fallback in case of GitHub rate limiting or network failure.
 */
function getFallbackProjects(): GithubProject[] {
  return [
    {
      slug: "BLACKBERRY",
      name: "BLACKBERRY",
      description: "BLACKBERRY PET - Full-stack web application and engineering codebase.",
      language: "JavaScript",
      topics: ["web", "full-stack", "react"],
      githubUrl: `https://github.com/${GITHUB_USERNAME}/BLACKBERRY`,
      liveUrl: "",
      stars: 0,
      forks: 0,
      createdAt: "2024",
      updatedAt: "2024",
      defaultBranch: "main",
      size: 120,
      license: "Open Source",
      openIssues: 0,
    },
  ];
}
