"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GitHubLogoIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { SITE_CONFIG } from "@/lib/constants";
import { useIsDark } from "@/lib/use-is-dark";

export const Footer = () => {
  const isDark = useIsDark();
  return (
    <footer className="border-t border-border bg-background py-12 text-muted-foreground font-sans transition-colors duration-200">
      <div className="h-2 w-full mb-10 bg-[repeating-linear-gradient(90deg,currentColor_0px,currentColor_1px,transparent_1px,transparent_8px)] text-border-subtle border-b border-border" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src={isDark ? "/logo-he.png" : "/logo-he-bl.png"}
                alt="DevClub"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed font-sans">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                aria-label="GitHub Repository"
              >
                <GitHubLogoIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.links.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                aria-label="DevClub UI on npm"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Components
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/components"
                  className="hover:text-foreground transition-colors"
                >
                  All Components
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=accordion"
                  className="hover:text-foreground transition-colors"
                >
                  Accordions
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=scales"
                  className="hover:text-foreground transition-colors"
                >
                  Scales & Borders
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=ai-stuff"
                  className="hover:text-foreground transition-colors"
                >
                  AI Stuff & Shaders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/installation"
                  className="hover:text-foreground transition-colors"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/theming"
                  className="hover:text-foreground transition-colors"
                >
                  Theming
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/cli"
                  className="hover:text-foreground transition-colors"
                >
                  CLI
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/skills"
                  className="hover:text-foreground transition-colors"
                >
                  Agent Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/registry"
                  className="hover:text-foreground transition-colors"
                >
                  Registry API
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/community"
                  className="hover:text-foreground transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/devclub-nstru/component_library/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  MIT License
                </a>
              </li>
              <li>
                <Link
                  href="/api/health"
                  className="hover:text-foreground transition-colors"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} devclub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/docs/registry"
              className="hover:text-foreground transition-colors"
            >
              Registry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
