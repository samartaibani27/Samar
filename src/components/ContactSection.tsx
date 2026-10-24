"use client";

import { useState, FormEvent } from "react";
import { profile } from "@/data/profile";
import { contactFormSchema } from "@/lib/contact-schema";
import {
  Mail,
  Check,
  ArrowUpRight,
  Send,
  AlertCircle,
  Copy,
  CheckCheck,
  MapPin,
  Clock,
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";

const INQUIRY_TYPES = [
  "Project",
  "Internship",
  "Collaboration",
  "General",
];

export function ContactSection() {
  const [selectedInquiry, setSelectedInquiry] = useState(INQUIRY_TYPES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [directWaUrl, setDirectWaUrl] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string;
    inquiryType?: string;
    message?: string;
  }>({});

  const cleanPhone = profile.phone.replace(/[^0-9]/g, "");

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(profile.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Strict Zod validation on every compulsory field
    const parsed = contactFormSchema.safeParse({
      name,
      email,
      whatsapp,
      inquiryType: selectedInquiry,
      message,
      hp,
    });

    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!errMap[fieldName]) {
          errMap[fieldName] = issue.message;
        }
      });
      setFieldErrors(errMap);
      setStatus("error");
      setErrorMessage(parsed.error.issues[0]?.message || "Please complete all compulsory fields.");
      return;
    }

    setFieldErrors({});
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          inquiryType: selectedInquiry,
          message: message.trim(),
          hp: hp.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to deliver message.");
      }

      setStatus("success");

      // Format WhatsApp dispatch message
      const formattedWaText = encodeURIComponent(
        `*New Inquiry from Portfolio*\n*From:* ${name.trim()}\n*Email:* ${email.trim()}\n*Phone:* ${whatsapp.trim()}\n*Category:* ${selectedInquiry}\n\n*Message:*\n${message.trim()}`
      );
      const waUrl = json.directWhatsAppUrl || `https://wa.me/${cleanPhone}?text=${formattedWaText}`;
      setDirectWaUrl(waUrl);

      // Automatically trigger WhatsApp dispatch so message reaches WhatsApp and Email simultaneously
      try {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      } catch (popupErr) {
        console.error("Popup blocked:", popupErr);
      }

      setName("");
      setEmail("");
      setWhatsapp("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again or reach out directly.";
      setStatus("error");
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ────── 2-COLUMN BALANCED CONTACT WORKSPACE ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ────── LEFT COLUMN: IDENTITY & DIRECT CONTACT ────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Availability notice */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-mono text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for internships and engineering projects</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                COMMUNICATION // CHANNEL
              </span>
              <span className="h-px w-10 bg-[var(--line)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight">
              Let&#39;s start a conversation
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed font-sans">
              Have an engineering inquiry, project proposal, internship opportunity, or technical collaboration? Send a note using the form or reach out directly across any channel.
            </p>
          </div>

          {/* Quick Direct Cards Stack */}
          <div className="space-y-3.5 pt-2">
            {/* Direct Email Card (Inbox badge removed, Copy button active) */}
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-2 hover:border-[var(--line-subtle)] transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#EA4335]" aria-hidden="true" />
                <span>Direct email</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono text-xs sm:text-sm font-semibold text-[var(--ink)] hover:text-[var(--accent)] transition-colors break-all"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono border border-[var(--line)] bg-[var(--surface-hover)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors cursor-pointer shrink-0"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Card (Fast reply badge removed, Copy button active) */}
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-2 hover:border-[var(--line-subtle)] transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" aria-hidden="true" />
                <span>Instant WhatsApp</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs sm:text-sm font-semibold text-[var(--ink)] hover:text-[#25D366] transition-colors"
                >
                  {profile.phone}
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono border border-[var(--line)] bg-[var(--surface-hover)] text-[var(--ink)] hover:border-[#25D366] transition-colors cursor-pointer shrink-0"
                  aria-label="Copy WhatsApp number"
                  title="Copy WhatsApp number"
                >
                  {copiedPhone ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Operational Coordinates Card */}
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[var(--muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Location</span>
                </div>
                <p className="font-semibold text-[var(--ink)]">
                  {profile.location}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[var(--muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>Response time</span>
                </div>
                <p className="font-semibold text-[var(--ink)]">
                  Under 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ────── RIGHT COLUMN: INTERACTIVE FORM WITH ZOD VALIDATION ────── */}
        <div className="lg:col-span-7">
          <div className="frosted-section-card p-6 sm:p-8 lg:p-10 border border-[var(--line)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-semibold block">
                  TRANSMISSION FORM
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Send a message
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[var(--muted)]">
                DISPATCH // 01
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Honeypot field for spam bots */}
              <div
                aria-hidden="true"
                className="opacity-0 absolute -z-50 w-0 h-0 overflow-hidden pointer-events-none select-none"
                tabIndex={-1}
              >
                <label htmlFor="website-url-hp">Website</label>
                <input
                  id="website-url-hp"
                  type="text"
                  name="website_url_hp"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Inquiry category chips (Compulsory) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] block">
                    Inquiry category <span className="text-[var(--accent)]">*</span>
                  </label>
                  {fieldErrors.inquiryType && (
                    <span className="text-[11px] font-mono text-red-600">
                      {fieldErrors.inquiryType}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Inquiry types">
                  {INQUIRY_TYPES.map((type) => {
                    const isSelected = selectedInquiry === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedInquiry(type);
                          if (fieldErrors.inquiryType) {
                            setFieldErrors((prev) => ({ ...prev, inquiryType: undefined }));
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-mono border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] ${
                          isSelected
                            ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold"
                            : "bg-[var(--surface)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name (Compulsory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contact-name" className="font-mono text-xs text-[var(--ink)] font-medium block">
                      Full name <span className="text-[var(--accent)]">*</span>
                    </label>
                  </div>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="Your name"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--muted)]/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors ${
                      fieldErrors.name ? "border-red-500 ring-1 ring-red-500" : "border-[var(--line)]"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] font-mono text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Address (Compulsory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contact-email" className="font-mono text-xs text-[var(--ink)] font-medium block">
                      Email address <span className="text-[var(--accent)]">*</span>
                    </label>
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--muted)]/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors ${
                      fieldErrors.email ? "border-red-500 ring-1 ring-red-500" : "border-[var(--line)]"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] font-mono text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp / Phone Number (Compulsory per user instructions) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-whatsapp" className="font-mono text-xs text-[var(--ink)] font-medium block">
                    WhatsApp or mobile number <span className="text-[var(--accent)]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[var(--muted)]">Min 10 digits</span>
                </div>
                <input
                  id="contact-whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (fieldErrors.whatsapp) {
                      setFieldErrors((prev) => ({ ...prev, whatsapp: undefined }));
                    }
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--muted)]/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors ${
                    fieldErrors.whatsapp ? "border-red-500 ring-1 ring-red-500" : "border-[var(--line)]"
                  }`}
                />
                {fieldErrors.whatsapp && (
                  <p className="text-[11px] font-mono text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.whatsapp}</span>
                  </p>
                )}
              </div>

              {/* Message Area (Compulsory) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="font-mono text-xs text-[var(--ink)] font-medium block">
                    Message <span className="text-[var(--accent)]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[var(--muted)]">
                    {message.length} / 3000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  maxLength={3000}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) {
                      setFieldErrors((prev) => ({ ...prev, message: undefined }));
                    }
                  }}
                  placeholder="Tell me about your project requirements, timeline, or engineering inquiry (min 10 characters)..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--muted)]/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors resize-y ${
                    fieldErrors.message ? "border-red-500 ring-1 ring-red-500" : "border-[var(--line)]"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="text-[11px] font-mono text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.message}</span>
                  </p>
                )}
              </div>

              {/* Status feedback */}
              {status === "error" && (
                <div className="flex items-center gap-2 p-3.5 rounded-lg border border-red-300 bg-red-50/90 text-red-800 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === "success" && (
                <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50/90 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Message received and dispatched to Email &amp; WhatsApp!</span>
                  </div>
                  {directWaUrl && (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={directWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Open WhatsApp chat</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="text-xs font-mono underline hover:text-emerald-700 cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button: Single "Send message" button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-xs font-mono font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{status === "loading" ? "Transmitting..." : "Send message"}</span>
                </button>

                <span className="text-[11px] font-mono text-[var(--muted)] text-center sm:text-right">
                  Dispatches to: <strong className="text-[var(--ink)]">Email</strong> &amp; <strong className="text-[var(--ink)]">WhatsApp</strong>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ────── BOTTOM BAR: DIRECT EMAIL & SOCIAL PROFILES WITH BRAND HOVER EFFECTS ────── */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Email Direct Access */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-card)] flex items-center justify-center text-[#EA4335] shadow-xs">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-0.5">
            <p className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider">
              Direct communication address
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-sm sm:text-base font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors break-all"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                aria-label="Copy email address"
                title="Copy address"
              >
                {copiedEmail ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Social Icons with Specific Brand Color Hover Effects */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] block md:text-right">
            Connected channels
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* GitHub - Black / Dark in Light Mode, White in Dark Mode on hover */}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[#181717] hover:text-white hover:border-[#181717] dark:hover:bg-white dark:hover:text-[#181717] dark:hover:border-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#181717]"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* LinkedIn - Brand Blue (#0A66C2) on hover */}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] dark:hover:bg-[#0A66C2] dark:hover:text-white dark:hover:border-[#0A66C2] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0A66C2]"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            {/* Instagram - Brand Pink/Rose (#E4405F) on hover */}
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] dark:hover:bg-[#E4405F] dark:hover:text-white dark:hover:border-[#E4405F] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E4405F]"
              aria-label="Instagram profile"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            {/* WhatsApp - Brand Green (#25D366) on hover */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-card)] text-[var(--ink)] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white dark:hover:border-[#25D366] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
              aria-label="WhatsApp chat"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
