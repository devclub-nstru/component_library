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

export function DocsSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden sticky top-14 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white"
        >
          {isOpen ? (
            <Cross2Icon className="h-4 w-4" />
          ) : (
            <HamburgerMenuIcon className="h-4 w-4" />
          )}
          <span>Documentation Menu</span>
        </button>
        <span className="text-[11px] font-mono text-zinc-500">
          {pathname === "/docs"
            ? "Introduction"
            : pathname.replace("/docs/", "").toUpperCase()}
        </span>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 top-24 z-20 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-14 z-20 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-black/95 p-6 transition-transform lg:static lg:block lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {DOCS_NAV.map((section) => (
            <div key={section.title} className="space-y-2.5">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/docs" &&
                      pathname === "/docs/introduction");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2 text-xs font-mono transition-all border ${
                          isActive
                            ? "border-white/20 bg-white/10 text-white font-medium"
                            : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRightIcon
                            className={`h-3 w-3 transition-transform ${
                              isActive
                                ? "text-white translate-x-0.5"
                                : "text-zinc-600 group-hover:text-zinc-400"
                            }`}
                          />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 border border-white/20 bg-white/5 text-zinc-300">
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

          <div className="pt-4 border-t border-white/10 space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Showcase
            </h4>
            <Link
              href="/components"
              className="flex items-center justify-between px-3 py-2 text-xs font-mono border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-zinc-200 transition-all"
            >
              <span>Explore Components</span>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
