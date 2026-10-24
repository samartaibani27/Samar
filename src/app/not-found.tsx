import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-mono text-[var(--accent)]">
          ERROR // 404
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Page not found
        </h1>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The requested route does not exist or has been relocated within the developer archive.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-mono font-semibold bg-[var(--accent-fill)] text-[var(--accent-foreground)] hover:bg-[var(--accent-fill-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
