"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GitHubLogoIcon, ExternalLinkIcon, EnvelopeClosedIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { SITE_CONFIG } from "@/lib/constants";
import { COMPONENT_CATEGORIES } from "@/lib/component-categories";
import { DOCS_NAV } from "@/lib/constants";
import { useIsDark } from "@/lib/use-is-dark";
import { ThemeToggle } from "@/components/ui/animated-theme-toggler";
import type { ComponentCategory } from "@/types/component";

const FOOTER_CATEGORY_IDS: ComponentCategory[] = [
  "accordion",
  "backgrounds-and-effects",
  "ai-stuff",
];

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { title: "All components", href: "/components" },
      ...FOOTER_CATEGORY_IDS.flatMap((id) =>
        COMPONENT_CATEGORIES.filter((category) => category.value === id).map((category) => ({
          title: category.label,
          href: `/components?category=${category.value}`,
        })),
      ),
    ],
  },
  {
    title: "Learn",
    links: DOCS_NAV.slice(0, 3).flatMap((section) => section.items),
  },
  {
    title: "Connect",
    links: [
      { title: "Community", href: "/docs/community" },
      { title: "Contribute", href: `${SITE_CONFIG.links.github}/blob/main/CONTRIBUTING.md` },
      { title: "Report an issue", href: `${SITE_CONFIG.links.github}/issues` },
      { title: "System status", href: "/api/health" },
      { title: "MIT license", href: `${SITE_CONFIG.links.github}/blob/main/LICENSE` },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub repository", href: SITE_CONFIG.links.github, icon: GitHubLogoIcon },
  { label: "DevClub UI on npm", href: SITE_CONFIG.links.npm, icon: ExternalLinkIcon },
  { label: "Email DevClub", href: SITE_CONFIG.links.email, icon: EnvelopeClosedIcon },
];

const linkClassName = "rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card";

export interface FooterProps {
  brand?: React.ReactNode;
  newsletter?: React.ReactNode;
  controls?: React.ReactNode;
}

export const Footer = ({ brand, newsletter, controls }: FooterProps = {}) => {
  const isDark = useIsDark();

  return (
    <footer className="border-t border-border bg-background px-4 py-6 font-sans sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-5 border-b border-border bg-linear-to-br from-foreground/5 via-transparent to-transparent p-6 sm:p-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Built to be yours</p>
            <p className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">Small details. Better interfaces.</p>
          </div>
          <Link href="/components" className="inline-flex min-h-11 w-fit shrink-0 items-center gap-4 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card">
            Explore components
            <ArrowTopRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12 lg:p-10">
          <div className="min-w-0 space-y-5">
            {brand ?? (
              <>
                <Link href="/" aria-label="DevClub home" className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card">
                  <Image src={isDark ? SITE_CONFIG.logos.dark : SITE_CONFIG.logos.light} alt="DevClub" width={180} height={60} className="h-12 w-auto object-contain" />
                </Link>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{SITE_CONFIG.description}</p>
              </>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-foreground/60" aria-hidden="true" />
              Open source. Made for everyone.
            </span>
            <div className="flex flex-wrap gap-2" aria-label="Find DevClub online">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined} aria-label={label} className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card">
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            {newsletter}
          </div>
          {FOOTER_GROUPS.map(({ title, links }) => (
            <nav key={title} aria-label={`${title} footer links`}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">{title}</h2>
              <ul className="space-y-1">
                {links.map(({ title: label, href }) => (
                  <li key={href}>
                    <Link href={href} className={`inline-flex min-h-9 items-center ${linkClassName}`} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="text-xs leading-relaxed text-muted-foreground">© {new Date().getFullYear()} DevClub. Built with care, shared with everyone.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/terms" className={linkClassName}>Terms</Link>
            <Link href="/privacy" className={linkClassName}>Privacy</Link>
            {controls ?? <ThemeToggle className="flex size-11 items-center justify-center rounded-full border border-border bg-background" />}
          </div>
        </div>
      </div>
    </footer>
  );
};
