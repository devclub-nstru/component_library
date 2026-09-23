import React from "react";
import Link from "next/link";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { SITE_CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-black py-12 text-zinc-400 font-mono">
      <div className="h-2 w-full mb-10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_8px)] border-b border-white/6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 border border-white flex items-center justify-center p-0.5">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-full h-full stroke-white"
                  strokeWidth="1.2"
                >
                  <rect x="1" y="1" width="14" height="14" />
                  <line x1="1" y1="1" x2="15" y2="15" />
                  <line x1="15" y1="1" x2="1" y2="15" />
                </svg>
              </div>
              <span className="font-sans font-medium text-base tracking-tight text-white">
                devclub
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed font-sans">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="GitHub Repository"
              >
                <GitHubLogoIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Twitter Account"
              >
                <TwitterLogoIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Components
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/components"
                  className="hover:text-white transition-colors"
                >
                  All Components
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=accordion"
                  className="hover:text-white transition-colors"
                >
                  Accordions
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=scales"
                  className="hover:text-white transition-colors"
                >
                  Scales & Borders
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=ai-stuff"
                  className="hover:text-white transition-colors"
                >
                  AI Stuff & Shaders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-white transition-colors"
                >
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/installation"
                  className="hover:text-white transition-colors"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/theming"
                  className="hover:text-white transition-colors"
                >
                  Theming
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/cli"
                  className="hover:text-white transition-colors"
                >
                  CLI
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/skills"
                  className="hover:text-white transition-colors"
                >
                  Agent Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/registry"
                  className="hover:text-white transition-colors"
                >
                  Registry API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Heyykrishnna/dev-club-components/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  MIT License
                </a>
              </li>
              <li>
                <Link
                  href="/api/health"
                  className="hover:text-white transition-colors"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} devclub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/docs/registry" className="hover:text-zinc-300 transition-colors">
              Registry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
