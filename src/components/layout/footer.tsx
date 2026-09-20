import React from "react";
import Link from "next/link";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { SITE_CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-linear-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-black text-xs">
                D
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Components
            </h4>
            <ul className="space-y-2 text-xs">
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
                  href="/components?category=buttons"
                  className="hover:text-white transition-colors"
                >
                  Animated Buttons
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=cards"
                  className="hover:text-white transition-colors"
                >
                  Spotlight Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/components?category=layout"
                  className="hover:text-white transition-colors"
                >
                  Bento Grids
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api/components"
                  className="hover:text-white transition-colors"
                >
                  REST API
                </Link>
              </li>
              <li>
                <Link
                  href="/api/health"
                  className="hover:text-white transition-colors"
                >
                  System Health
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <GitHubLogoIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <TwitterLogoIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>
            © {new Date().getFullYear()} DevClub UI. Built for modern engineers.
          </p>
          <p>MIT Licensed. Free for commercial and personal projects.</p>
        </div>
      </div>
    </footer>
  );
};
