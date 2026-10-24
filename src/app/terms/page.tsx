import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions of use for the personal portfolio of Taibani Samar.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded p-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to home</span>
        </Link>
      </div>

      <div className="space-y-8">
        <header className="space-y-2 border-b border-[var(--line)] pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
            LEGAL // 02
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Terms and conditions
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Effective date: October 2026
          </p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-[var(--text-muted)] font-sans">
          <h2 className="text-xl font-bold text-[var(--text)]">Purpose of site</h2>
          <p>
            This website serves as the informational and project exhibition portfolio of {profile.name}.
            All information provided is for general demonstration, portfolio review, and contact purposes.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Intellectual property</h2>
          <p>
            The original design, layout, code samples, and content on this portfolio belong to {profile.name} unless
            otherwise stated or attributed to open source libraries. Open source dependencies remain subject to their respective licenses.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">External links</h2>
          <p>
            This site contains links to external platforms such as GitHub, LinkedIn, and Instagram.
            {profile.name} is not responsible for the content, security, or privacy practices of external third-party sites.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Disclaimer</h2>
          <p>
            This site is provided on an &quot;as is&quot; basis without warranties of any kind. Reasonable efforts are made to ensure accuracy and availability, but no guarantees are given that the site will always be uninterrupted or error-free.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Contact</h2>
          <p>
            For any questions regarding these terms, please contact {profile.name} at:{" "}
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-[var(--accent)] hover:underline"
            >
              {profile.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
