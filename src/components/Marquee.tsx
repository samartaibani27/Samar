export function Marquee() {
  const items = [
    { text: "MODERN FULL-STACK WEB APPLICATIONS", badge: "FOCUS" },
    { text: "NEXT.JS 16 • REACT 19 • NODE.JS", badge: "STACK" },
    { text: "TYPESCRIPT • SCALABLE REST APIS", badge: "ENGINEERING" },
    { text: "ACCESSIBLE WCAG AA COMPLIANT INTERFACES", badge: "STANDARDS" },
    { text: "CLEAN MODULAR ARCHITECTURE", badge: "CODE" },
    { text: "BASED IN GUJARAT, INDIA", badge: "LOCATION" },
  ];

  return (
    <div
      className="w-full bg-[var(--surface)] text-[var(--ink)] py-3.5 border-y border-[var(--line)] overflow-hidden select-none transition-colors duration-400"
      aria-hidden="true"
    >
      <div className="animate-marquee flex items-center">
        {/* Render twice for continuous seamless infinite loop */}
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex items-center gap-8 shrink-0 pr-8">
            {items.map((item, idx) => (
              <span
                key={`${setIndex}-${idx}`}
                className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[var(--ink)]"
              >
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-fill)] text-white tracking-wider">
                  {item.badge}
                </span>
                <span className="font-semibold text-[var(--ink)]">{item.text}</span>
                <span className="text-[var(--accent)] text-sm font-bold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
