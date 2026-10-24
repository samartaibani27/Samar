# Taibani Samar: Personal Portfolio Website

Production-grade, accessible personal portfolio website built with Next.js (App Router, TypeScript), Tailwind CSS v4, and Lucide icons. Features dynamic zero-maintenance synchronization with GitHub repositories, markdown documentation rendering, interactive 3D ID credential badge, and WCAG AA compliance.

## Architecture and Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 and Vanilla CSS design tokens (warm off-white/charcoal palette with terracotta accent)
- **Typography:** Fraunces (display headings), Inter (body copy), and IBM Plex Mono (technical labels and numerals) via `next/font/google`
- **GitHub Automation:** Live repository synchronization with GitHub REST API (`samartaibani27`), ISR cache revalidation (60s), live deployment detection, and automated README markdown parser
- **Security:** Enterprise HTTP headers (HSTS, CSP, FrameGuard, NoSniff, ReferrerPolicy), contact form honeypot bot trap, IP-based in-memory rate limiting, and strict Zod schema validation
- **Metadata and SEO:** Next.js Metadata API, dynamic Open Graph generation with `next/og`, `sitemap.xml`, `robots.txt`, and structured JSON-LD Person schema

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## Environment Variables

Copy `.env.example` to `.env.local` to configure optional integrations:

```env
NEXT_PUBLIC_SITE_URL=https://samartaibani.vercel.app

# Optional: Higher GitHub API rate limits
GITHUB_TOKEN=

# Optional: Form submission email dispatch via Resend
RESEND_API_KEY=
SAMAR_RECEIVER_EMAIL=taibanisamar@gmail.com

# Optional: WhatsApp dispatch
CALLMEBOT_API_KEY=
SAMAR_WHATSAPP_NUMBER=+917984733139
```

---

## Deploying to Vercel

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Complete portfolio QA audit, GitHub automation, and Vercel setup"
   git branch -M main
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Vercel automatically detects Next.js settings and uses `vercel.json` for edge headers.
4. Deploy the project.
5. In your Vercel project dashboard, navigate to **Settings > Domains** to connect your custom domain with automatic HTTPS.
