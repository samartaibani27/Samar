export interface Education {
  degree: string;
  college: string;
  passingYear: string;
  url?: string;
}

export interface SkillGroup {
  layer: string;
  skills: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  category: string;
  year: string;
  githubUrl: string;
  liveUrl: string;
  overview?: string;
  features?: string[];
  role?: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  institution: string;
  description: string;
  type: "education" | "experience" | "certificate";
}

export interface ProfileData {
  name: string;
  fullName: string;
  initials: string;
  status: string;
  role: string;
  tagline: string;
  aboutMe: string;
  education: Education | Education[];
  currentlyWorkingOn: string;
  technicalCoreSummary: string;
  skillsGrouped: SkillGroup[];
  projects: Project[];
  experience: TimelineEntry[];
  certificates: TimelineEntry[];
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
  phone: string;
  photoUrl: string;
  photo2Url: string;
  resumeUrl: string;
  instagramPhotos: string[];
  location: string;
  timezone: string;
}

export const TODO_PLACEHOLDER = "TODO: add this";

export const profile: ProfileData = {
  name: "Taibani Samar",
  fullName: "Taibani Mo Samar Aarifbhai",
  initials: "TS",
  status: "Available",
  role: "Full-Stack Web Developer and Student",
  tagline: "BCA graduate and MCA student building clean web systems.",
  aboutMe: "I am a full-stack web developer and computer applications student based in Gujarat, India. Having completed my Bachelor of Computer Applications (BCA) from Veer Narmad South Gujarat University (2023 to 2026), I am now pursuing my Master of Computer Applications (MCA) at Uka Tarsadia University (started in 2026). My work as a full-stack developer focuses on building reliable, scalable web applications and structured database architectures.",
  education: [
    {
      degree: "MCA (Master of Computer Applications)",
      college: "Uka Tarsadia University (UTU)",
      passingYear: "2026 - Present (Pursuing)",
      url: "https://www.utu.ac.in",
    },
    {
      degree: "BCA (Bachelor of Computer Applications)",
      college: "Veer Narmad South Gujarat University (VNSGU)",
      passingYear: "2023 - 2026 (Completed)",
      url: "https://www.vnsgu.ac.in",
    },
  ],
  currentlyWorkingOn: "",
  technicalCoreSummary: "Engineering accessible web applications, typed API architectures, and reliable database structures with modern toolchains.",
  skillsGrouped: [
    {
      layer: "Languages",
      skills: ["JavaScript", "TypeScript", "Java", "HTML5", "CSS3", "SQL"],
    },
    {
      layer: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "Responsive UI", "Web Accessibility"],
    },
    {
      layer: "Backend",
      skills: ["Node.js", "Express", "REST APIs", "API Architecture", "Server Actions"],
    },
    {
      layer: "Database and Cloud",
      skills: ["MySQL", "Firebase"],
    },
    {
      layer: "Tools",
      skills: ["Git", "GitHub", "VS Code", "Postman", "Antigravity", "Cursor AI", "npm"],
    },
  ],
  projects: [],
  experience: [],
  certificates: [],
  github: "https://github.com/samartaibani27",
  linkedin: "https://www.linkedin.com/in/taibani-samar-7236123b0",
  instagram: "https://www.instagram.com/samar__taibani__27",
  email: "taibanisamar@gmail.com",
  phone: "+91 79847 33139",
  photoUrl: "/samar.jpg",
  photo2Url: "/photo2.png",
  resumeUrl: "",
  instagramPhotos: [],
  location: "Gujarat, India",
  timezone: "Asia/Kolkata",
};
