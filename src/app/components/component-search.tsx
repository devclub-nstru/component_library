"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRightIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import gsap from "gsap";
import { fetchComponents } from "@/lib/registry";
import { getAllComponents } from "@/registry";
import { CandyButton } from "@/registry/ui/candy-button";
import type { ComponentRegistryItem } from "@/types/component";

interface SearchPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExitComplete: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  recommendations: ComponentRegistryItem[];
  matchCount: number;
  totalCount: number;
}

function SearchPanel({
  open,
  onOpenChange,
  onExitComplete,
  query,
  onQueryChange,
  recommendations,
  matchCount: _matchCount,
  totalCount: _totalCount,
}: SearchPanelProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const recommendationRefs = useRef(new Map<string, HTMLAnchorElement>());
  const inputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const inputId = useId();
  const router = useRouter();
  const searchTerm = query.trim();
  const recommendationKey = recommendations.map((item) => item.slug).join("|");

  useLayoutEffect(() => {
    const highlight = highlightRef.current;
    if (!highlight) return;
    const selected =
      highlightedSlug && recommendationRefs.current.get(highlightedSlug);
    if (!selected) {
      highlight.style.opacity = "0";
      return;
    }
    highlight.style.transform = `translate3d(${selected.offsetLeft}px, ${selected.offsetTop}px, 0)`;
    highlight.style.width = `${selected.offsetWidth}px`;
    highlight.style.height = `${selected.offsetHeight}px`;
    highlight.style.opacity = "1";
  }, [highlightedSlug, recommendationKey]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(panel, {
        opacity: 0,
        y: reducedMotion ? 0 : -12,
        scale: reducedMotion ? 1 : 0.975,
      });
      timelineRef.current = gsap
        .timeline({ paused: true, onReverseComplete: onExitComplete })
        .to(
          overlay,
          {
            opacity: 1,
            duration: reducedMotion ? 0 : 0.24,
            ease: "power2.out",
          },
          0,
        )
        .to(
          panel,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reducedMotion ? 0 : 0.34,
            ease: "power3.out",
          },
          0,
        );
    }, panel);

    timelineRef.current?.play();
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      context.revert();
    };
  }, [onExitComplete]);

  useEffect(() => {
    if (open) timelineRef.current?.play();
    else timelineRef.current?.reverse();
  }, [open]);

  useEffect(() => {
    const results = resultsRef.current;
    if (!results) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.killTweensOf(results);
    const tween = gsap.fromTo(
      results,
      { opacity: 0.72, y: 3 },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [recommendationKey]);

  return (
    <>
      <Dialog.Overlay
        ref={overlayRef}
        className="fixed inset-0 z-110 bg-black/55 backdrop-blur-[3px]"
      />
      <Dialog.Content
        ref={panelRef}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className="fixed inset-x-4 top-1/2 z-120 mx-auto flex max-h-[calc(100dvh-2rem)] w-auto max-w-xl -translate-y-1/2 origin-center flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white text-zinc-900 shadow-[0_32px_100px_rgba(0,0,0,0.3)] outline-none dark:border-white/12 dark:bg-[#101014] dark:text-white"
      >
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
          <div>
            <Dialog.Title className="font-serif text-xl tracking-tight sm:text-2xl">
              Search components
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              Find a component by name, keyword, or description.
            </Dialog.Description>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close component search"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/30"
          >
            <Cross2Icon aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (searchTerm && recommendations[0]) {
              onOpenChange(false);
              router.push(`/components/${recommendations[0].slug}`);
            }
          }}
          className="mx-5 mt-4 flex h-13 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 focus-within:border-zinc-400 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-white/25 sm:mx-6"
        >
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-zinc-400"
          />
          <label htmlFor={inputId} className="sr-only">
            Search components
          </label>
          <input
            id={inputId}
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setHighlightedSlug(null);
              onQueryChange(event.target.value);
            }}
            placeholder="Search components..."
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500 sm:text-base"
          />
          <span className="hidden rounded-md border border-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-white/10 sm:block">
            ESC
          </span>
        </form>

        <div className="min-h-0 max-h-[min(56vh,420px)] overflow-y-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <div ref={resultsRef}>
            {recommendations.length > 0 ? (
              <div
                className="relative"
                onPointerLeave={() => setHighlightedSlug(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setHighlightedSlug(null);
                }}
              >
                <div
                  ref={highlightRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-0 rounded-xl bg-zinc-900/6 opacity-0 transition-[transform,width,height,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-white/10 motion-reduce:transition-none"
                />
                <ul
                  className="relative z-10 flex flex-col gap-1"
                  aria-label="Component recommendations"
                >
                  {recommendations.map((item) => (
                    <li key={item.slug}>
                      <Link
                        ref={(node) => {
                          if (node)
                            recommendationRefs.current.set(item.slug, node);
                          else recommendationRefs.current.delete(item.slug);
                        }}
                        href={`/components/${item.slug}`}
                        onClick={() => onOpenChange(false)}
                        onPointerEnter={() => setHighlightedSlug(item.slug)}
                        onFocus={() => setHighlightedSlug(item.slug)}
                        className="group relative flex min-h-14 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/30 motion-reduce:transition-none"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {item.name}
                          </span>
                          <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {item.category.replaceAll("-", " ")}
                          </span>
                        </span>
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-zinc-400 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Sorry, our components are playing hide and seek. Try a shorter
                search.
              </p>
            )}
          </div>

          <p className="mt-3 border-t border-zinc-200 px-1 pt-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            {searchTerm
              ? recommendations.length > 0
                ? "Choose a component, or press Enter for the first match."
                : "Try a different name or keyword."
              : "Start typing to find a component, or pick one above."}
          </p>
        </div>
      </Dialog.Content>
    </>
  );
}

export function ComponentSearch() {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [query, setQuery] = useState("");
  const allComponents = useMemo(() => getAllComponents(), []);
  const searchTerm = query.trim();
  const searchMatches = useMemo(
    () => (searchTerm ? fetchComponents({ query: searchTerm }) : []),
    [searchTerm],
  );
  const recommendations = useMemo(
    () =>
      (searchTerm ? [...searchMatches] : allComponents.slice(0, 4))
        .sort(
          (a, b) =>
            Number(b.name.toLowerCase().startsWith(searchTerm.toLowerCase())) -
            Number(a.name.toLowerCase().startsWith(searchTerm.toLowerCase())),
        )
        .slice(0, 5),
    [allComponents, searchMatches, searchTerm],
  );
  const onExitComplete = useCallback(() => {
    setPresent(false);
    setQuery("");
  }, []);

  if (open && !present) setPresent(true);

  return (
    <Dialog.Root open={present} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <CandyButton
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search components"
          variant="pearl"
          size="icon"
          className="size-9 shrink-0 rounded-full transition-[box-shadow,filter,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-foreground/30 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          <MagnifyingGlassIcon aria-hidden="true" className="size-4" />
        </CandyButton>
      </Dialog.Trigger>
      {present && (
        <Dialog.Portal>
          <SearchPanel
            open={open}
            onOpenChange={setOpen}
            onExitComplete={onExitComplete}
            query={query}
            onQueryChange={setQuery}
            recommendations={recommendations}
            matchCount={searchMatches.length}
            totalCount={allComponents.length}
          />
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
