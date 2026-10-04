"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { MobilePanel } from "./mobile-panel";
import { useMediaQuery } from "@/lib/use-media-query";
import { DOCS_NAV } from "@/lib/constants";
import {
  HamburgerMenuIcon,
  Cross2Icon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMobileNav = useMediaQuery("(max-width: 1023px)");

  const navigation = (
    <div className="space-y-8">
      {DOCS_NAV.map((section) => (
        <div key={section.title} className="space-y-2">
          <h4 className="text-[11px] font-sans font-medium uppercase tracking-wider text-muted-foreground/80 px-2 select-none">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/docs" && pathname === "/docs/introduction");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "relative group flex min-h-11 items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-all",
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-docs-sidebar-item"
                        transition={{
                          type: "spring",
                          stiffness: 480,
                          damping: 32,
                          mass: 0.8,
                        }}
                        className="absolute inset-0 rounded-xl bg-foreground/6 dark:bg-white/10 shadow-xs border border-border/50 dark:border-white/10 z-0"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <ChevronRightIcon
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-150",
                          isActive
                            ? "text-foreground translate-x-0.5"
                            : "text-muted-foreground/60 group-hover:text-foreground",
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="relative z-10 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground border border-border/50">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="pt-4 border-t border-border space-y-2">
        <h4 className="text-[11px] font-sans font-medium uppercase tracking-wider text-muted-foreground/80 px-2 select-none">
          Library
        </h4>
        <Link
          href="/components"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
        >
          <span>Browse Components</span>
          <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md w-full gap-3 px-4 py-1.5">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen && isMobileNav}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-11 items-center gap-2 text-xs font-sans text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isOpen ? (
            <Cross2Icon className="h-4 w-4" />
          ) : (
            <HamburgerMenuIcon className="h-4 w-4" />
          )}
          <span>Documentation Menu</span>
        </button>
        <span className="text-xs font-sans text-muted-foreground capitalize">
          {pathname === "/docs"
            ? "Introduction"
            : pathname.replace("/docs/", "")}
        </span>
      </div>

      <MobilePanel open={isOpen && isMobileNav} onOpenChange={setIsOpen} title="Documentation" triggerRef={triggerRef}>
        {navigation}
      </MobilePanel>

      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-background p-6 lg:sticky lg:top-16 lg:z-10 lg:block lg:h-[calc(100dvh-4rem)] lg:self-start">
        {navigation}
      </aside>
    </>
  );
}
