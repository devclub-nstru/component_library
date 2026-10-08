"use client";

import React, { useState, useEffect } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { CandyButton } from "@/registry/ui/candy-button";

interface GitHubButtonProps {
  className?: string;
}

function formatStars(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}

export function GitHubButton({ className }: GitHubButtonProps) {
  const [stars, setStars] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github/stars", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stars: number | null } | null) => {
        if (typeof data?.stars === "number") {
          setStars(formatStars(data.stars));
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <CandyButton
      as="a"
      href={SITE_CONFIG.links.github}
      target="_blank"
      rel="noopener noreferrer"
      variant="obsidian"
      size="sm"
      aria-label={
        stars ? `GitHub repository with ${stars} stars` : "GitHub repository"
      }
      className={cn(
        "group h-9 px-3.5 rounded-xl font-medium tracking-tight",
        className,
      )}
      leftIcon={
        <GitHubLogoIcon className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform duration-200" />
      }
    >
      {stars && (
        <span className="font-sans font-medium text-xs sm:text-sm tracking-tight text-white leading-none">
          {stars}
        </span>
      )}
    </CandyButton>
  );
}
