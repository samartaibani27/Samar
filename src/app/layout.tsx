import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/IntroLoader";
import { profile } from "@/data/profile";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samartaibani.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} : Full-Stack Developer Portfolio`,
    template: `%s : ${profile.name}`,
  },
  description:
    "Personal portfolio of Taibani Samar: Full-stack developer specializing in Next.js, React, Node.js, and accessible web systems.",
  keywords: [
    "Taibani Samar",
    "Samar Taibani",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Gujarat",
    "India",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${profile.name} : Full-Stack Developer Portfolio`,
    description:
      "Full-stack developer building robust web applications, typed APIs, and accessible digital interfaces.",
    siteName: `${profile.name} Portfolio`,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${profile.name} Portfolio Open Graph Banner`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} : Full-Stack Developer Portfolio`,
    description:
      "Full-stack developer building robust web applications, typed APIs, and accessible digital interfaces.",
    images: [`${siteUrl}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    image: `${siteUrl}${profile.photoUrl}`,
    email: profile.email,
    jobTitle: "Full-Stack Developer",
    sameAs: [profile.github, profile.linkedin, profile.instagram],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Gujarat",
      addressCountry: "India",
    },
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${ibmMono.variable}`}
    >
      <head>
        {/* Anti-flash theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('samar-theme');
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            })();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between relative">
        <IntroLoader />
        <Navbar />
        <main id="main-content" className="flex-grow focus:outline-none relative z-10">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
