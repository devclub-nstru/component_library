"use client";

import React, { useState, useRef, useCallback, useId, memo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

export const DEVCLUB_INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    author: "Yash Sharma",
    role: "Founding Engineer",
    company: "DevClub NST",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "DevClub UI saved my sleep schedule and centered all my divs on the very first try. Genuinely 10/10.",
  },
  {
    id: 1,
    author: "Jensen Huang",
    role: "GPU Overlord",
    company: "NVIDIA",
    avatar:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "The more DevClub components you copy, the more time you save. It's the law of modern frontend physics.",
  },
  {
    id: 2,
    author: "Priya Nair",
    role: "Ex-Burnout Lead",
    company: "0 to 1 Startup",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "I copied three buttons from DevClub NST and suddenly our seed investors thought we hired Apple's design lead.",
  },
  {
    id: 3,
    author: "Cristiano Ronaldo",
    role: "Perfectionist",
    company: "CR7 Brand",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "Siiiuuu! The micro-interactions in this library have better curve control than my best free kicks.",
  },
];

export const DEVCLUB_ADDITIONAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 4,
    author: "Kabir Sen",
    role: "Figma Whisperer",
    company: "Studio Craft",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "Our product designer actually cried happy tears when my PR matched their Figma spring transitions on day one.",
  },
  {
    id: 5,
    author: "Sarah Chen",
    role: "Junior Developer",
    company: "HyperScale",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "I still don't fully understand GSAP timelines, but DevClub UI makes everyone think I have 8 years of WebGL mastery.",
  },
  {
    id: 6,
    author: "Vikram Das",
    role: "Fullstack Vibe Engineer",
    company: "NST Hackers",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "If DevClub NST goes offline, 90% of college startup landing pages will instantly collapse into plain HTML tables.",
  },
  {
    id: 7,
    author: "Elena Rostova",
    role: "Head of Motion",
    company: "Neon Dynamics",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "The spring dampening curves in these components are so silky they should honestly require a safety permit.",
  },
  {
    id: 8,
    author: "Aisha Patel",
    role: "Product Manager",
    company: "FlowState",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "My CEO asked why our staging site looks like Linear and Apple had a baby. I just smiled and whispered 'DevClub'.",
  },
  {
    id: 9,
    author: "Devansh Rao",
    role: "Hackathon Speedrunner",
    company: "Speedrunners Inc",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "Shipped 4 MVP submissions in 36 hours. Judges thought we didn't sleep for a week. We were just chilling with DevClub UI.",
  },
  {
    id: 10,
    author: "Sneha Reddy",
    role: "VP of Centering Divs",
    company: "CloudSync",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "I used to spend half my sprint debugging Safari blur artifacts. With DevClub UI, everything just works out of the box.",
  },
  {
    id: 11,
    author: "Antony Raphy",
    role: "Chief Vibe Officer",
    company: "Indie Hacker",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&auto=format&fit=crop&crop=faces&q=80",
    quote:
      "Replaced 4,000 lines of spaghetti animation boilerplate with a single DevClub primitive. Finally touched grass.",
  },
];

const TestimonialSpanItem = memo(function TestimonialSpanItem({
  item,
  isHovered,
  hasHover,
  onHover,
}: {
  item: Testimonial;
  isHovered: boolean;
  hasHover: boolean;
  onHover: (id: number) => void;
}) {
  const stateClass = !hasHover
    ? "opacity-80 blur-0 text-zinc-600 dark:text-zinc-400"
    : isHovered
      ? "opacity-100 blur-0 text-zinc-950 dark:text-zinc-50"
      : "opacity-25 blur-[1.5px] text-zinc-400 dark:text-zinc-600";

  const avatarClass = !hasHover
    ? "opacity-90 grayscale-[15%] scale-100"
    : isHovered
      ? "opacity-100 grayscale-0 scale-105 shadow-sm"
      : "opacity-30 grayscale-[75%] blur-[0.6px] scale-[0.96]";

  return (
    <span
      onMouseEnter={() => onHover(item.id)}
      className={cn(
        "inline cursor-pointer select-none transition-all duration-300 ease-out will-change-[opacity,filter,color] motion-reduce:transition-none motion-reduce:blur-none",
        stateClass,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center align-middle mr-2 sm:mr-2.5 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full overflow-hidden shrink-0 aspect-square select-none [clip-path:circle(50%_at_50%_50%)] transition-all duration-300 ease-out will-change-[transform,filter,opacity] motion-reduce:transition-none motion-reduce:blur-none motion-reduce:scale-100",
          avatarClass,
        )}
      >
        <img
          src={item.avatar}
          alt={item.author}
          width={44}
          height={44}
          loading="eager"
          className="block w-full h-full rounded-full object-cover select-none pointer-events-none [clip-path:circle(50%_at_50%_50%)]"
        />
      </span>
      {item.quote}
      <span className="relative inline-block w-0 h-0 align-baseline" />{" "}
    </span>
  );
});

export interface FocusTestimonialsProps {
  initialItems?: Testimonial[];
  additionalItems?: Testimonial[];
  className?: string;
  cardClassName?: string;
}

export function FocusTestimonials({
  initialItems = DEVCLUB_INITIAL_TESTIMONIALS,
  additionalItems = DEVCLUB_ADDITIONAL_TESTIMONIALS,
  className,
  cardClassName,
}: FocusTestimonialsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const quotesId = useId();
  const reduceMotion = useReducedMotion();

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 340, mass: 0.4 };
  const smoothX = useSpring(rawMouseX, springConfig);
  const smoothY = useSpring(rawMouseY, springConfig);

  const allItems = React.useMemo(
    () => [...initialItems, ...additionalItems],
    [initialItems, additionalItems],
  );

  const activeItem =
    hoveredId !== null ? allItems.find((t) => t.id === hoveredId) : null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawMouseX.set(e.clientX - rect.left);
      rawMouseY.set(e.clientY - rect.top);
    },
    [rawMouseX, rawMouseY],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleHover = useCallback((id: number) => {
    setHoveredId(id);
  }, []);

  const handleToggleShowMore = () => {
    setShowMore((prev) => {
      const nextState = !prev;
      if (
        !nextState &&
        hoveredId !== null &&
        hoveredId >= initialItems.length
      ) {
        setHoveredId(null);
      }
      return nextState;
    });
  };

  const hasHover = hoveredId !== null;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent select-none",
        className,
      )}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative z-10 flex w-full max-w-5xl flex-col p-4 sm:p-6 md:p-8 transition-colors duration-200",
          cardClassName,
        )}
      >
        <AnimatePresence>
          {activeItem && (
            <motion.div
              key="author-tooltip"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 6,
                transition: reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: "easeOut" },
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              }
              style={{
                x: reduceMotion ? rawMouseX : smoothX,
                y: reduceMotion ? rawMouseY : smoothY,
                translateX: 18,
                translateY: -56,
              }}
              className="pointer-events-none absolute left-0 top-0 z-50 flex items-center rounded-full border border-white/20 bg-zinc-950/90 px-3 py-1.5 text-white shadow-2xl backdrop-blur-xl will-change-[transform,opacity]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeItem.id}
                  initial={{
                    opacity: 0,
                    filter: reduceMotion ? "blur(0px)" : "blur(3px)",
                  }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    filter: reduceMotion ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.14, ease: "easeOut" }
                  }
                  className="flex items-center gap-2.5"
                >
                  <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 aspect-square [clip-path:circle(50%_at_50%_50%)]">
                    <img
                      src={activeItem.avatar}
                      alt={activeItem.author}
                      width={28}
                      height={28}
                      className="block h-full w-full object-cover rounded-full border-0 outline-none shadow-none ring-0 [clip-path:circle(50%_at_50%_50%)] select-none pointer-events-none"
                    />
                  </div>
                  <div className="flex flex-col leading-tight select-none">
                    <span className="text-xs sm:text-sm font-semibold tracking-tight text-white whitespace-nowrap">
                      {activeItem.author}
                    </span>
                    <span className="text-[10px] sm:text-xs font-normal text-zinc-300 whitespace-nowrap">
                      {activeItem.role} ·{" "}
                      <span className="font-medium text-white">
                        {activeItem.company}
                      </span>
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          id={quotesId}
          onMouseLeave={() => setHoveredId(null)}
          className="relative flex-1 text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal leading-[160%] tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {initialItems.map((item) => (
            <TestimonialSpanItem
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              hasHover={hasHover}
              onHover={handleHover}
            />
          ))}

          <AnimatePresence>
            {showMore && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: "easeOut" }
                }
                className="inline"
              >
                {" "}
                {additionalItems.map((item) => (
                  <TestimonialSpanItem
                    key={item.id}
                    item={item}
                    isHovered={hoveredId === item.id}
                    hasHover={hasHover}
                    onHover={handleHover}
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            aria-expanded={showMore}
            aria-controls={quotesId}
            onClick={handleToggleShowMore}
            className="group inline-flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs sm:text-sm tracking-tight text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors active:scale-[0.98] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40 motion-reduce:active:scale-100"
          >
            <span>
              {showMore
                ? "Show less"
                : `Read all testimonials (${allItems.length})`}
            </span>

            <motion.span
              animate={{ rotate: showMore ? 180 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 360, damping: 22 }
              }
              className="inline-flex"
            >
              <ChevronDown className="h-3.5 w-3.5 text-current" />
            </motion.span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocusTestimonials;
