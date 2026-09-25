"use client";

import React, { useState, useEffect } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { CandyButton } from "@/registry/ui/candy-button";

interface GitHubButtonProps {
  className?: string;
  repoUrl?: string;
  initialStars?: string;
}

export function GitHubButton({
  className,
  repoUrl = SITE_CONFIG.links.github,
  initialStars = "-",
}: GitHubButtonProps) {
  const [stars, setStars] = useState(initialStars);

  useEffect(() => {
    let isMounted = true;
    const fetchStars = async () => {
      try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        const repoPath = match
          ? `${match[1]}/${match[2].replace(/\.git$/, "")}`
          : "devclub-nstru/component_library";

        const response = await fetch(
          `https://api.github.com/repos/${repoPath}`,
          { headers: { Accept: "application/vnd.github.v3+json" } },
        );
        if (!response.ok) {
          if (isMounted) setStars("-");
          return;
        }
        const data = await response.json();
        if (isMounted && typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          if (count >= 1000000) {
            setStars(`${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`);
          } else if (count >= 1000) {
            setStars(`${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`);
          } else {
            setStars(count.toString());
          }
        } else if (isMounted) {
          setStars("-");
        }
      } catch {
        if (isMounted) {
          setStars("-");
        }
      }
    };

    fetchStars();
    return () => {
      isMounted = false;
    };
  }, [repoUrl]);

  return (
    <CandyButton
      as="a"
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      variant="obsidian"
      size="sm"
      aria-label={`GitHub repository with ${stars} stars`}
      className={cn(
        "group h-9 px-3.5 rounded-xl font-medium tracking-tight",
        className,
      )}
      leftIcon={
        <GitHubLogoIcon className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform duration-200" />
      }
    >
      <span className="font-sans font-medium text-xs sm:text-sm tracking-tight text-white leading-none">
        {stars}
      </span>
    </CandyButton>
  );
}
