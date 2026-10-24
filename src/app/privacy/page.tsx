import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the personal portfolio of Taibani Samar.",
};

export default function PrivacyPage() {
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
            LEGAL // 01
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Privacy policy
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Effective date: October 2026
          </p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-[var(--text-muted)] font-sans">
          <h2 className="text-xl font-bold text-[var(--text)]">Overview</h2>
          <p>
            This website is a personal developer portfolio for {profile.name}. Your privacy is respected and prioritized.
            This policy outlines what data this website touches and why.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Data collection</h2>
          <p>
            This website does not collect personal data, does not use advertising tracking cookies, and does not operate any backend server database to capture visitor information.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Local browser storage</h2>
          <p>
            The website uses basic browser storage solely to enhance your viewing experience:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-mono text-xs">
            <li>
              <strong className="text-[var(--text)]">samar-theme:</strong> Stored in your browser&#39;s localStorage to remember your dark or light visual mode preference.
            </li>
            <li>
              <strong className="text-[var(--text)]">samar_intro_seen:</strong> Stored in sessionStorage so the introductory animation displays only once per browser session.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Direct communications</h2>
          <p>
            When you submit the contact form, your submitted fields are sent directly to me by email (via Resend) and as a WhatsApp notification (via CallMeBot) if enabled. No message data is stored in a database by this site. Those delivery services process the transmission under their respective privacy policies.
          </p>

          <h2 className="text-xl font-bold text-[var(--text)] pt-4">Contact</h2>
          <p>
            If you have questions regarding this policy, contact {profile.name} at:{" "}
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
