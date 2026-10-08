"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface TwitterCardProps {
  username: string;
  name?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  staticCard?: boolean;
  joinedDate?: string;
  year?: number | string;
  text?: string;
  linkText?: string;
  href?: string;
  enableLinkTilt?: boolean;
  linkTiltMaxRotate?: number;
  enableCardTilt?: boolean;
  cardTiltMaxRotate?: number;
  className?: string;
  popoverClassName?: string;
  linkClassName?: string;
  labelClassName?: string;
}

const VIEWPORT_MARGIN = 24;

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 22 22"
    className={cn("shrink-0 fill-current", className)}
    aria-label="Verified account"
  >
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.27-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.136 2.136 5.408-5.407 1.293 1.292-6.701 6.709z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const DefaultAvatar = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
      className,
    )}
  >
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

export const TwitterCard = ({
  username,
  name = "Twitter User",
  avatarUrl,
  bannerUrl,
  staticCard = false,
  joinedDate,
  year = 2026,
  text = "Follow me on",
  linkText = "X",
  href,
  enableLinkTilt = true,
  linkTiltMaxRotate = 5,
  enableCardTilt = true,
  cardTiltMaxRotate = 5,
  className,
  popoverClassName,
  linkClassName,
  labelClassName,
}: TwitterCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const [failedBanner, setFailedBanner] = useState<string | null>(null);

  const profileUrl = href || `https://x.com/${username}`;
  const linkRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tapRevealRef = useRef(false);
  const [cardShift, setCardShift] = useState(0);

  const [profile, setProfile] = useState({
    name: name || "Twitter User",
    avatarUrl: avatarUrl || "",
    bannerUrl: bannerUrl || "",
    bio: "This user hasn't added a bio yet.",
    following: 0,
    followers: 0,
    joinedDate: joinedDate || `Joined ${year}`,
    location: "",
    website: null as { url: string; display_url: string } | null,
    verified: false,
  });

  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    const controller = new AbortController();

    fetch(`https://api.fxtwitter.com/${username}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        if (data.code === 200 && data.user) {
          const user = data.user;
          const formattedJoined = user.joined
            ? `Joined ${new Date(user.joined).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}`
            : joinedDate || `Joined ${year}`;

          setProfile({
            name: user.name || name || "Twitter User",
            avatarUrl:
              user.avatar_url?.replace("_normal", "_400x400") ||
              avatarUrl ||
              "",
            bannerUrl: user.banner_url || bannerUrl || "",
            bio: user.description || "This user hasn't added a bio yet.",
            following: user.following ?? 0,
            followers: user.followers ?? 0,
            joinedDate: formattedJoined,
            location: user.location || "",
            website: user.website || null,
            verified: Boolean(user.verification?.verified),
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username, name, avatarUrl, bannerUrl, joinedDate, year]);

  const linkX = useMotionValue(0);
  const linkY = useMotionValue(0);
  const linkSpringX = useSpring(linkX, { stiffness: 320, damping: 24 });
  const linkSpringY = useSpring(linkY, { stiffness: 320, damping: 24 });

  const linkRotateX = useTransform(
    linkSpringY,
    [-1, 1],
    [linkTiltMaxRotate, -linkTiltMaxRotate],
  );
  const linkRotateY = useTransform(
    linkSpringX,
    [-1, 1],
    [-linkTiltMaxRotate, linkTiltMaxRotate],
  );

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardSpringX = useSpring(cardX, {
    stiffness: 300,
    damping: 24,
    mass: 0.6,
  });
  const cardSpringY = useSpring(cardY, {
    stiffness: 300,
    damping: 24,
    mass: 0.6,
  });

  const cardRotateX = useTransform(
    cardSpringY,
    [-1, 1],
    [cardTiltMaxRotate, -cardTiltMaxRotate],
  );
  const cardRotateY = useTransform(
    cardSpringX,
    [-1, 1],
    [-cardTiltMaxRotate, cardTiltMaxRotate],
  );

  const handleLinkMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableLinkTilt || !linkRef.current || prefersReducedMotion) return;
      const rect = linkRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      linkX.set(Math.max(-1, Math.min(1, nx)));
      linkY.set(Math.max(-1, Math.min(1, ny)));
    },
    [enableLinkTilt, linkX, linkY, prefersReducedMotion],
  );

  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableCardTilt || !cardRef.current || prefersReducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      cardX.set(Math.max(-1, Math.min(1, nx)));
      cardY.set(Math.max(-1, Math.min(1, ny)));
    },
    [enableCardTilt, cardX, cardY, prefersReducedMotion],
  );

  const handleContainerMouseLeave = useCallback(() => {
    setIsHovered(false);
    linkX.set(0);
    linkY.set(0);
    cardX.set(0);
    cardY.set(0);
  }, [linkX, linkY, cardX, cardY]);

  useLayoutEffect(() => {
    if (!isHovered) return;
    const updateShift = () => {
      const container = containerRef.current;
      const card = cardRef.current;
      if (!container || !card) return;
      const box = container.getBoundingClientRect();
      const width = card.offsetWidth;
      const naturalLeft = box.left + box.width / 2 - width / 2;
      const maxLeft = window.innerWidth - VIEWPORT_MARGIN - width;
      const left = Math.max(VIEWPORT_MARGIN, Math.min(maxLeft, naturalLeft));
      setCardShift(left - naturalLeft);
    };
    updateShift();
    window.addEventListener("resize", updateShift);
    return () => window.removeEventListener("resize", updateShift);
  }, [isHovered]);

  useEffect(() => {
    if (!isHovered) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        handleContainerMouseLeave();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isHovered, handleContainerMouseLeave]);

  const handleTriggerPointerDown = (e: React.PointerEvent) => {
    tapRevealRef.current = e.pointerType !== "mouse" && !isHovered;
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!tapRevealRef.current) return;
    tapRevealRef.current = false;
    e.preventDefault();
    setIsHovered(true);
  };

  const handleContainerBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      handleContainerMouseLeave();
    }
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isHovered) handleContainerMouseLeave();
  };

  const handleStaticMouseLeave = useCallback(() => {
    cardX.set(0);
    cardY.set(0);
  }, [cardX, cardY]);

  const formatCount = (count: number | string | undefined): string => {
    if (count === undefined || count === null) return "0";
    if (typeof count === "string") return count;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return count.toLocaleString("en-US");
  };

  const ProfileLink = staticCard ? "span" : "a";

  const cardContent = (
    <div className="flex flex-col text-left">
      <div className="relative -mx-4 -mt-4 h-24 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-900">
        {profile.bannerUrl && failedBanner !== profile.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt="Profile Banner"
            onError={() => setFailedBanner(profile.bannerUrl)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900" />
        )}
      </div>

      <div className="relative mb-2 flex items-start justify-between">
        <div className="relative z-10 -mt-8 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-md dark:border-neutral-950 dark:bg-neutral-900">
          {profile.avatarUrl && failedAvatar !== profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}'s Avatar`}
              onError={() => setFailedAvatar(profile.avatarUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>

        <ProfileLink
          {...(!staticCard
            ? {
                href: profileUrl,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
          className="mt-2 text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200"
          aria-label={`View @${username} on X`}
        >
          <XIcon className="h-5 w-5" />
        </ProfileLink>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold leading-snug tracking-tight text-neutral-900 dark:text-white">
            {profile.name}
          </span>
          {profile.verified && (
            <VerifiedBadge className="h-4 w-4 text-sky-500 dark:text-sky-400" />
          )}
        </div>
        <ProfileLink
          {...(!staticCard
            ? {
                href: profileUrl,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          @{username}
        </ProfileLink>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        {profile.bio}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        {profile.location && (
          <div className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            <span>{profile.location}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" />
            <ProfileLink
              {...(!staticCard
                ? {
                    href: profile.website.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {})}
              className="text-sky-600 hover:underline dark:text-sky-400"
            >
              {profile.website.display_url}
            </ProfileLink>
          </div>
        )}

        {profile.joinedDate && (
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{profile.joinedDate}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCount(profile.following)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Following
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCount(profile.followers)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Followers
          </span>
        </div>
      </div>
    </div>
  );

  if (staticCard) {
    return (
      <div
        className={cn(
          "relative inline-block w-80 perspective-[1000px]",
          className,
        )}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleStaticMouseLeave}
          style={
            enableCardTilt && !prefersReducedMotion
              ? {
                  rotateX: cardRotateX,
                  rotateY: cardRotateY,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
          className={cn(
            "w-80 rounded-2xl border border-dashed border-neutral-300 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/80",
            popoverClassName,
          )}
        >
          {cardContent}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "text-lg font-medium text-neutral-900/60 transition-colors dark:text-neutral-100/60",
          labelClassName,
        )}
      >
        {text}
      </span>

      <div
        ref={containerRef}
        className="relative inline-flex flex-col items-center perspective-[1000px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleContainerMouseLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={handleContainerBlur}
        onKeyDown={handleContainerKeyDown}
      >
        <motion.div
          ref={linkRef}
          onMouseMove={handleLinkMouseMove}
          style={
            enableLinkTilt && !prefersReducedMotion
              ? {
                  rotateX: linkRotateX,
                  rotateY: linkRotateY,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
          className="cursor-pointer"
        >
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
            onPointerDown={handleTriggerPointerDown}
            onClick={handleTriggerClick}
          >
            <span
              className={cn(
                "text-lg font-medium text-neutral-900/60 underline underline-offset-4 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-100/60 dark:hover:text-neutral-100",
                linkClassName,
              )}
            >
              {linkText}
            </span>
          </a>
        </motion.div>

        <div
          inert={!isHovered}
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3.5"
          style={{ transform: `translateX(calc(-50% + ${cardShift}px))` }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={{
              hidden: {
                opacity: 0,
                y: 8,
                scale: 0.97,
                filter: "blur(2px)",
                pointerEvents: "none",
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                pointerEvents: "auto",
                transition: {
                  type: "spring",
                  damping: 24,
                  stiffness: 300,
                },
              },
            }}
            style={
              enableCardTilt && !prefersReducedMotion
                ? {
                    rotateX: cardRotateX,
                    rotateY: cardRotateY,
                    transformStyle: "preserve-3d",
                  }
                : undefined
            }
            className={cn(
              "w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-dashed border-neutral-300 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-colors select-text dark:border-neutral-800 dark:bg-neutral-950/85",
              "after:absolute after:top-full after:left-0 after:h-4 after:w-full after:content-['']",
              popoverClassName,
            )}
          >
            {cardContent}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;
