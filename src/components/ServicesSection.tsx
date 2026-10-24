import { Code2, Layout, Server, Database } from "lucide-react";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: typeof Code2;
  technologies: string[];
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Full-stack web development",
    description:
      "Building complete web applications from schema design to frontend interfaces. Prioritizing performance, clean architecture, and maintainable codebases.",
    icon: Code2,
    technologies: ["Next.js", "TypeScript", "React", "Node.js"],
  },
  {
    number: "02",
    title: "Frontend and UI engineering",
    description:
      "Crafting responsive, accessible interfaces that meet WCAG standards. Implementing semantic HTML, responsive layouts, and structured design tokens.",
    icon: Layout,
    technologies: ["Tailwind CSS", "Modern CSS", "Accessibility", "Responsive Layouts"],
  },
  {
    number: "03",
    title: "Backend and APIs",
    description:
      "Creating predictable RESTful endpoints, token authentication, and data validation layers. Ensuring secure requests and organized server routes.",
    icon: Server,
    technologies: ["Node.js", "Express", "REST APIs", "Auth"],
  },
  {
    number: "04",
    title: "Database design",
    description:
      "Structuring relational and document schemas for reliable query performance and clean data models. Managing relationships and data consistency.",
    icon: Database,
    technologies: ["PostgreSQL", "MongoDB", "Data Modeling", "SQL"],
  },
];

export function ServicesSection() {
  return (
    <section className="frosted-section-card p-6 sm:p-10 lg:p-12 relative overflow-hidden" aria-labelledby="services-heading">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
            02 // SERVICES
          </span>
          <span className="h-px w-10 bg-[var(--line)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Capabilities
          </span>
        </div>

        <div className="max-w-2xl mb-10">
          <h2 id="services-heading" className="heading-fluid-lg font-bold tracking-tight text-[var(--ink)]">
            Core engineering services
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
            Focused technical offerings spanning modern web architecture, responsive interface delivery, and structured data systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className="p-6 sm:p-8 rounded-xl card-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)] mb-5">
                    <span className="font-mono text-xs text-[var(--accent)] font-bold">
                      {service.number}
                    </span>
                    <Icon className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 font-sans">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--line-subtle)]">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-[var(--surface-hover)] border border-[var(--line-subtle)] text-[var(--muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
