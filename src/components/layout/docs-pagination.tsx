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
    <div className="pt-10 mt-16 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
      {prevItem ? (
        <Link
          href={prevItem.href}
          className="group flex flex-col items-start gap-1 p-4 border border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5 transition-all text-left flex-1"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-300">
            <ArrowLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Previous</span>
          </div>
          <span className="text-sm font-sans font-medium text-zinc-200 group-hover:text-white">
            {prevItem.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}

      {nextItem && (
        <Link
          href={nextItem.href}
          className="group flex flex-col items-end gap-1 p-4 border border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5 transition-all text-right flex-1"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-300">
            <span>Next</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
          <span className="text-sm font-sans font-medium text-zinc-200 group-hover:text-white">
            {nextItem.title}
          </span>
        </Link>
      )}
    </div>
  );
}
