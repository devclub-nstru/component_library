"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/constants";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

export function DocsPagination() {
  const pathname = usePathname();
  const allItems = DOCS_NAV.flatMap((section) => section.items);

  const currentIndex = allItems.findIndex(
    (item) =>
      item.href === pathname ||
      (item.href === "/docs" && pathname === "/docs/introduction"),
  );

  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < allItems.length - 1
      ? allItems[currentIndex + 1]
      : null;

  return (
    <div className="pt-10 mt-16 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans">
      {prevItem ? (
        <Link
          href={prevItem.href}
          className="group flex flex-col items-start gap-1 p-4 rounded-2xl border border-border/80 hover:border-foreground/20 bg-card/50 hover:bg-muted/40 transition-all text-left flex-1 shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Previous</span>
          </div>
          <span className="text-sm font-sans font-medium text-foreground">
            {prevItem.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}

      {nextItem && (
        <Link
          href={nextItem.href}
          className="group flex flex-col items-end gap-1 p-4 rounded-2xl border border-border/80 hover:border-foreground/20 bg-card/50 hover:bg-muted/40 transition-all text-right flex-1 shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            <span>Next</span>
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
          <span className="text-sm font-sans font-medium text-foreground">
            {nextItem.title}
          </span>
        </Link>
      )}
    </div>
  );
}
