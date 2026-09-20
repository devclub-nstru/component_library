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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-linear-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-black text-xs">
              D
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
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
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <GitHubLogoIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
          <Link
            href="/components"
            className="rounded-md bg-linear-to-t from-blue-700 to-blue-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-110 transition-all"
          >
            Explore
          </Link>
          <button
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
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
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
