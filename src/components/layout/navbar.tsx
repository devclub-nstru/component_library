"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HamburgerMenuIcon,
  Cross2Icon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GitHubButton } from "@/components/ui/github-button";
import { CandyButton } from "@/registry/ui/candy-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export interface NavbarProps {
  showThemeToggle?: boolean;
}

export const Navbar = ({ showThemeToggle }: NavbarProps = {}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const shouldShowThemeToggle =
    showThemeToggle !== undefined ? showThemeToggle : !isHomePage;

  return (
    <header className="sticky top-0 z-100 w-full border-b border-border bg-background/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="group flex items-center shrink-0 focus-visible:outline-none"
            aria-label="DevClub Home"
          >
            <span className="font-sans font-semibold text-lg tracking-tight text-foreground transition-colors group-hover:opacity-80">
              devclub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "text-foreground bg-foreground/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <GitHubButton />

          {shouldShowThemeToggle && (
            <AnimatedThemeToggler className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 shrink-0" />
          )}

          <CandyButton
            as={Link}
            href="/components"
            variant="pearl"
            size="sm"
            className="hidden sm:inline-flex h-9 px-4 rounded-full font-semibold text-xs sm:text-sm shrink-0"
            rightIcon={<ChevronRightIcon className="w-3.5 h-3.5" />}
          >
            <span>Components</span>
          </CandyButton>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <Cross2Icon className="h-4 w-4" />
            ) : (
              <HamburgerMenuIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 px-4 py-4 space-y-3 backdrop-blur-xl">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground bg-foreground/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-2">
            <CandyButton
              as={Link}
              href="/components"
              onClick={() => setMobileMenuOpen(false)}
              variant="pearl"
              size="default"
              className="w-full rounded-full font-semibold text-sm"
              rightIcon={<ChevronRightIcon className="w-4 h-4" />}
            >
              <span>Explore Components</span>
            </CandyButton>
          </div>
        </div>
      )}
    </header>
  );
};
