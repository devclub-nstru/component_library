"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useIsDark } from "@/lib/use-is-dark";

export interface NavbarProps {
  showThemeToggle?: boolean;
  forceLight?: boolean;
  searchAction?: React.ReactNode;
}

export const Navbar = ({ showThemeToggle, forceLight, searchAction }: NavbarProps = {}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDark = useIsDark();
  const isHomePage = pathname === "/";
  const shouldShowThemeToggle =
    showThemeToggle !== undefined ? showThemeToggle : !isHomePage;

  return (
    <header
      className={cn(
        "sticky top-0 z-100 w-full border-b transition-colors duration-200",
        forceLight
          ? "border-zinc-200 bg-white/95 backdrop-blur-xl"
          : "border-border bg-background/85 backdrop-blur-xl",
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center shrink-0 focus-visible:outline-none"
            aria-label="DevClub Home"
          >
            <Image
              src={isDark ? "/logo-he.png" : "/logo-he-bl.png"}
              alt="DevClub"
              width={180}
              height={60}
              className="h-12 w-auto object-contain transition-opacity group-hover:opacity-80"
              priority
            />
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
                    "px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150",
                    forceLight
                      ? isActive
                        ? "text-zinc-900 bg-zinc-900/10 font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5"
                      : isActive
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
          {searchAction}
          <GitHubButton />

          {shouldShowThemeToggle && (
            <AnimatedThemeToggler
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 shrink-0",
                forceLight
                  ? "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 focus-visible:ring-zinc-300"
                  : "border-border bg-foreground/5 hover:bg-foreground/10 text-foreground focus-visible:ring-foreground/20",
              )}
            />
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
            className={cn(
              "md:hidden w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0",
              forceLight
                ? "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900"
                : "border-border bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground",
            )}
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
        <div
          className={cn(
            "md:hidden border-b px-4 py-4 space-y-3 backdrop-blur-xl",
            forceLight
              ? "border-zinc-200 bg-white/95"
              : "border-border bg-background/95",
          )}
        >
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
                    forceLight
                      ? isActive
                        ? "text-zinc-900 bg-zinc-900/10 font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5"
                      : isActive
                        ? "text-foreground bg-foreground/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center gap-2">
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
