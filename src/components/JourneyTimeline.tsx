import { profile, Education } from "@/data/profile";
import { isTodo, getSafeText } from "@/lib/profile-utils";
import { GraduationCap, Briefcase, Award, Clock, ArrowUpRight } from "lucide-react";

interface TimelineItem {
  period: string;
  title: string;
  subtitle: string;
  description?: string;
  icon: typeof GraduationCap;
  type: string;
  url?: string;
}

export function JourneyTimeline() {
  const items: TimelineItem[] = [];

  // Education entries (newest first)
  const eduList: Education[] = Array.isArray(profile.education)
    ? profile.education
    : profile.education
    ? [profile.education]
    : [];

  eduList.forEach((edu) => {
    if (!isTodo(edu.degree)) {
      items.push({
        period: getSafeText(edu.passingYear, "Pursuing"),
        title: edu.degree,
        subtitle: edu.college,
        icon: GraduationCap,
        type: "Education",
        url: edu.url,
      });
    }
  });

  // 3. Additional experience entries from profile.ts
  if (profile.experience && profile.experience.length > 0) {
    profile.experience.forEach((exp) => {
      if (!isTodo(exp.title)) {
        items.push({
          period: exp.year,
          title: exp.title,
          subtitle: exp.institution,
          description: exp.description,
          icon: Briefcase,
          type: "Experience",
        });
      }
    });
  }

  // 4. Certificates from profile.ts
  if (profile.certificates && profile.certificates.length > 0) {
    profile.certificates.forEach((cert) => {
      if (!isTodo(cert.title)) {
        items.push({
          period: cert.year,
          title: cert.title,
          subtitle: cert.institution,
          description: cert.description,
          icon: Award,
          type: "Certificate",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="relative pl-6 sm:pl-8 border-l border-[var(--line)] space-y-8">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`${item.title}-${idx}`} className="relative group">
              {/* Dot / Icon indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </div>

              <div className="p-5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-subtle)] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--line-subtle)] mb-3">
                  <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                    {item.period}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--line-subtle)]">
                    {item.type}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text)]">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${item.subtitle} website (opens in a new tab)`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 text-xs font-mono rounded btn-slide text-[var(--text)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0 self-start sm:self-auto"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>

                {item.description ? (
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-3 leading-relaxed font-sans">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
