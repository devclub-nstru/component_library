"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HamburgerMenuIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
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
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={SITE_CONFIG.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-white/15 px-3 py-1 text-xs font-mono text-zinc-300 hover:bg-white/5 hover:text-white hover:border-white/40 transition-colors"
          >
            <GitHubLogoIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link
            href="/components"
            className="border border-white/20 hover:border-white/50 px-3 py-1 text-xs font-mono text-white hover:bg-white/5 transition-all"
          >
            Components
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? (
              <Cross2Icon className="h-5 w-5" />
            ) : (
              <HamburgerMenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-black px-4 py-4 space-y-3 font-mono">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-white py-1"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
