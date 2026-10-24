import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Taibani Samar for software development inquiries, internships, and engineering collaborations.",
};

export default function ContactPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24">
      <ContactSection />
    </div>
  );
}
