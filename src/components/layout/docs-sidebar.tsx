"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <>
      <div className="lg:hidden sticky top-14 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-sans text-muted-foreground hover:text-foreground cursor-pointer"
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

      {isOpen && (
        <div
          className="fixed inset-0 top-24 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-14 z-20 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-background p-6 transition-all duration-200 lg:static lg:block lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
                          "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-all",
                          isActive
                            ? "bg-foreground/5 dark:bg-white/10 text-foreground font-medium shadow-xs"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-2">
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
                          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground border border-border/50">
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
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
            >
              <span>Browse Components</span>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
