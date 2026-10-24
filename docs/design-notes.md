# Design Notes: Samar Taibani Portfolio

## Analysis of Reference Sites

### 1. Umer Saiyad (https://umer-saiyad.vercel.app/)
- **Ideas borrowed:** Clear section hierarchy (About, Services, Skills, Journey timeline), layered skill chips grouped by architectural tier, and structured personal quick facts.
- **Differences in Samar's portfolio:** We avoid high-intensity glows, avoid animated cursor trails, and eliminate full-screen pinned scroll hijacking. Instead of generic card layouts, we use an editorial grid layout with fine mechanical borders, custom typography, and strict WCAG AA contrast.

### 2. Harsh Rathore (https://harshrathore.vercel.app/)
- **Ideas borrowed:** Brief cinematic intro loader with percentage counter (0 to 100%) and accessible skip option, interactive contact chips that dynamically set mailto subjects, one-tap clipboard copy for email with inline feedback, and expandable project archive rows.
- **Differences in Samar's portfolio:** We remove excessive decorative film grain, noisy vignettes, and over-the-top brutalist oversized watermarks. We replace luxury-fashion branding with a clean, modern software engineer aesthetic using deep blue-slate neutrals and a single teal accent (#0b6b86 / #4fb8d6).

### 3. Salim President (https://salimpresident.vercel.app/)
- **Ideas borrowed:** Sticky navbar with developer logo mark, centered navigation links, live availability pill, quick "Let's Talk" CTA, slow horizontal marquee ribbon, and the 3D flip credential ID badge (photo on front, technical core on back, accessible via keyboard Enter/Space and pointer tap).
- **Differences in Samar's portfolio:** We make the card accessible for all viewports without breaking layout on smaller mobile screens, include full theme switching support (dark and light modes), eliminate template redundancies, and ensure all placeholder data gracefully hides in production mode.

### 4. Sujan Multani (https://sujanmultani.vercel.app/)
- **Ideas borrowed:** Lenis smooth scrolling integrated with GSAP ScrollTrigger ticker, dark default theme with a confident single accent, and live IST timezone clock in the footer.
- **Differences in Samar's portfolio:** We remove the custom circular cursor follower, remove noisy aurora backdrops, choose a distinct typeface pairing (Bricolage Grotesque display and IBM Plex Sans/Mono body), and implement strict developer-mode placeholder guards.

## Distinct Visual Identity for Samar Taibani
1. **Typography:** Bricolage Grotesque for headlines (tight, characterful sentence-case display), IBM Plex Sans for readable body copy (around 65ch width), and IBM Plex Mono for badges, metadata, and technical labels.
2. **Color System:** Dark mode default (#0c1015 slate-black ground, #151b23 elevated surface) with a single crisp teal-cyan accent (#4fb8d6 in dark mode, #0b6b86 in light mode). High-contrast neutrals with slight cool-slate undertones. No purple gradients or glowing buttons.
3. **Signature Detail:** Technical blueprint grid lines and minimalist code-comment styling (`//`) for section headers and metadata chips.
4. **Resilience & Motion:** Lenis smooth scroll and GSAP ScrollTrigger respect `prefers-reduced-motion` unconditionally. All content is fully visible by default even if JavaScript is disabled.
