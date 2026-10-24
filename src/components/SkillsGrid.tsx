import { profile } from "@/data/profile";
import { isTodo, isProduction } from "@/lib/profile-utils";

export function SkillsGrid() {
  const isProd = isProduction();

  // Filter or process skill groups
  const visibleGroups = profile.skillsGrouped
    .map((group) => {
      const activeSkills = group.skills.filter((s) => !isTodo(s));
      const hasTodos = group.skills.some((s) => isTodo(s));
      return {
        layer: group.layer,
        skills: activeSkills,
        hasTodos,
      };
    })
    .filter((group) => {
      // In production, hide groups that have zero actual skills
      if (isProd && group.skills.length === 0) {
        return false;
      }
      return true;
    });

  if (visibleGroups.length === 0) {
    if (isProd) return null;
    return (
      <div className="p-6 border border-dashed border-[var(--line)] rounded-lg text-center font-mono text-xs text-[var(--text-muted)]">
        Skills details pending in profile.ts
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleGroups.map((group, idx) => (
        <div
          key={group.layer}
          className="p-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-4">
              <span className="font-mono text-xs text-[var(--accent)] font-bold">
                {`0${idx + 1} // LAYER`}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Stack
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text)] mb-4">
              {group.layer}
            </h3>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded bg-[var(--surface-card)] border border-[var(--line)] text-xs font-mono text-[var(--text)] hover:border-[var(--accent)] transition-colors"
                >
                  {skill}
                </span>
              ))}

              {/* In development, show subtle placeholder if TODO exists */}
              {!isProd && group.hasTodos && (
                <span className="px-3 py-1.5 rounded border border-dashed border-[var(--text-muted)] text-xs font-mono text-[var(--text-muted)]">
                  [TODO: add skills]
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
