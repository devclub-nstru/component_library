"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

export type ThemeValue = "light" | "dark" | "system";

export type ProfileMenuStatusItem = {
  text: string;
  icon?: ReactNode;
};

export type StatusInput = string | ProfileMenuStatusItem;

export type ProfileMenuItem = {
  name: string;
  icon?: ReactNode;
  shortcut?: string;
  badge?: ReactNode;
  active?: boolean;
  centered?: boolean;
  danger?: boolean;
  closeOnSelect?: boolean;
  onSelect?: () => void;
};

export type ProfileMenuSection = {
  label?: string;
  grid?: boolean;
  items: ProfileMenuItem[];
};

export interface ProfileMenuProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  avatarSrc?: string;
  avatar?: ReactNode;
  status?: StatusInput[];
  statusInterval?: number;
  sections?: ProfileMenuSection[];
  theme?: ThemeValue;
  onThemeChange?: (theme: ThemeValue) => void;
  shortcutKey?: string;
  online?: boolean;
  id?: string;
  className?: string;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/c9/3d/c8/c93dc8fdae8629e56c85e7b2a10ffd7b.jpg";

const DEFAULT_STATUS_ITEMS: ProfileMenuStatusItem[] = [
  {
    text: "Designing interactive systems",
    icon: <SparklesIcon />,
  },
  {
    text: "Available for select projects",
    icon: <ZapIcon />,
  },
  {
    text: "San Francisco, CA · 10:42 AM",
    icon: <MapPinIcon />,
  },
  {
    text: "Design Engineer @ DevClub",
    icon: <TerminalIcon />,
  },
];

const STYLES = `
@keyframes pm-slide-in {
  0% {
    opacity: 0;
    transform: translateY(5px);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
`;

const subscribePlatform = () => () => { };
const getPlatformSnapshot = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const getServerSnapshot = () => false;

export function ProfileMenu({
  title = "Yatharth K.",
  avatarSrc = DEFAULT_AVATAR,
  avatar,
  status,
  statusInterval = 3600,
  sections,
  theme,
  onThemeChange,
  shortcutKey = "k",
  online = true,
  id = "profile-command-menu",
  className,
}: ProfileMenuProps) {
  const isApple = useSyncExternalStore(
    subscribePlatform,
    getPlatformSnapshot,
    getServerSnapshot,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [selected, setSelected] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [internalTheme, setInternalTheme] = useState<ThemeValue>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  const activeTheme = theme ?? internalTheme;

  const panelRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawStatuses = status ?? DEFAULT_STATUS_ITEMS;
  const statusItems: ProfileMenuStatusItem[] = rawStatuses.map((s) =>
    typeof s === "string" ? { text: s } : s,
  );

  const handleCopyEmail = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@devclub.co");
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncTheme = () => {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        setInternalTheme(stored);
      } else {
        setInternalTheme(
          document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        );
      }
    };

    const observer = new MutationObserver(() => {
      if (!localStorage.getItem("theme")) {
        syncTheme();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", syncTheme);
    window.addEventListener("theme-change", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("theme-change", syncTheme);
    };
  }, []);

  const handleThemeSelect = useCallback(
    (nextTheme: ThemeValue) => {
      setInternalTheme(nextTheme);
      onThemeChange?.(nextTheme);
      if (typeof document !== "undefined") {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.style.colorScheme = "dark";
          try {
            localStorage.setItem("theme", "dark");
          } catch { }
        } else if (nextTheme === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.style.colorScheme = "light";
          try {
            localStorage.setItem("theme", "light");
          } catch { }
        } else {
          const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          document.documentElement.classList.toggle("dark", isDark);
          document.documentElement.style.colorScheme = isDark
            ? "dark"
            : "light";
          try {
            localStorage.setItem("theme", "system");
          } catch { }
        }
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "theme",
            newValue: nextTheme,
          }),
        );
        window.dispatchEvent(
          new CustomEvent("theme-change", {
            detail: { theme: nextTheme },
          }),
        );
      }
    },
    [onThemeChange],
  );

  const defaultSections: ProfileMenuSection[] = [
    {
      label: "Navigation",
      items: [
        {
          name: "View Profile",
          icon: <UserIcon />,
          shortcut: "⌘P",
          closeOnSelect: true,
          onSelect: () => {
            window.open("https://github.com/devclub-nstru", "_blank");
          },
        },
        {
          name: "Projects & Works",
          icon: <FolderIcon />,
          shortcut: "⌘J",
          closeOnSelect: true,
          onSelect: () => {
            window.open("https://github.com/devclub-nstru", "_blank");
          },
        },
        {
          name: copied ? "Email Copied!" : "Copy Email",
          icon: copied ? <CheckIcon /> : <CopyIcon />,
          shortcut: copied ? undefined : "⌘C",
          badge: copied ? (
            <span className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md bg-emerald-500/10">
              Copied!
            </span>
          ) : undefined,
          closeOnSelect: false,
          onSelect: handleCopyEmail,
        },
        {
          name: "Book a Call",
          icon: <CalendarIcon />,
          shortcut: "⌘B",
          closeOnSelect: true,
          onSelect: () => {
            window.open("https://cal.com", "_blank");
          },
        },
      ],
    },
    {
      label: "Social",
      items: [
        {
          name: "GitHub",
          icon: <GithubIcon />,
          badge: <ExternalLinkIcon />,
          closeOnSelect: true,
          onSelect: () => {
            window.open("https://github.com/devclub-nstru", "_blank");
          },
        },
        {
          name: "Twitter / X",
          icon: <TwitterIcon />,
          badge: <ExternalLinkIcon />,
          closeOnSelect: true,
          onSelect: () => {
            window.open("https://x.com", "_blank");
          },
        },
      ],
    },
  ];

  const resolvedSections: ProfileMenuSection[] = [
    ...(sections || defaultSections),
  ];

  resolvedSections.push({
    label: "Appearance",
    grid: true,
    items: [
      {
        name: "Light",
        icon: <SunIcon />,
        centered: true,
        active: activeTheme === "light",
        closeOnSelect: false,
        onSelect: () => handleThemeSelect("light"),
      },
      {
        name: "Dark",
        icon: <MoonIcon />,
        centered: true,
        active: activeTheme === "dark",
        closeOnSelect: false,
        onSelect: () => handleThemeSelect("dark"),
      },
      {
        name: "System",
        icon: <SystemIcon />,
        centered: true,
        active: activeTheme === "system",
        closeOnSelect: false,
        onSelect: () => handleThemeSelect("system"),
      },
    ],
  });

  const items = resolvedSections.flatMap((s) => s.items);
  const itemsRef = useRef(items);
  const selectedRef = useRef(selected);

  useEffect(() => {
    itemsRef.current = items;
    selectedRef.current = selected;
  }, [items, selected]);

  useLayoutEffect(() => {
    const hl = highlightRef.current;
    if (!hl) return;
    if (!isOpen || selected < 0) {
      hl.style.opacity = "0";
      return;
    }
    const element = itemRefs.current[selected];
    if (!element) return;
    hl.style.transform = `translate3d(${element.offsetLeft}px, ${element.offsetTop}px, 0)`;
    hl.style.width = `${element.offsetWidth}px`;
    hl.style.height = `${element.offsetHeight}px`;
    hl.style.opacity = "1";
  }, [isOpen, selected]);

  useEffect(() => {
    if (isOpen || statusItems.length < 2) return;
    const interval = setInterval(() => {
      if (!document.hidden) {
        setStatusIndex((prev) => (prev + 1) % statusItems.length);
      }
    }, statusInterval);
    return () => clearInterval(interval);
  }, [isOpen, statusItems.length, statusInterval]);

  const toggleMenu = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setSelected(0);
    setIsOpen((prev) => {
      const next = !prev;
      setIsPinned(next);
      return next;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!isOpen) {
      setSelected(0);
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (isPinned) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, [isPinned]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCmdOrCtrl = isApple ? event.metaKey : event.ctrlKey;
      if (
        event.key.toLowerCase() === shortcutKey.toLowerCase() &&
        isCmdOrCtrl
      ) {
        event.preventDefault();
        toggleMenu();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isApple, shortcutKey, toggleMenu]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      const count = itemsRef.current.length;
      if (count === 0) return;

      const move = (delta: number) => {
        setSelected((prev) => (prev + delta + count) % count);
      };

      switch (event.key) {
        case "ArrowUp":
        case "k":
          event.preventDefault();
          move(-1);
          break;
        case "ArrowDown":
        case "j":
          event.preventDefault();
          move(1);
          break;
        case "Enter": {
          event.preventDefault();
          const target = itemsRef.current[selectedRef.current];
          if (target) {
            target.onSelect?.();
            if (target.closeOnSelect) {
              setIsOpen(false);
              setIsPinned(false);
            }
          }
          break;
        }
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setIsPinned(false);
          break;
      }
    }

    function onClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(`#${id}`)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClickOutside);
    };
  }, [isOpen, id]);

  const currentStatus = statusItems[statusIndex];

  return (
    <div
      id={id}
      role="region"
      aria-label="Profile command menu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-90 max-w-[calc(100vw-2rem)] rounded-2xl select-none",
        "bg-background/95 dark:bg-zinc-950/90 text-foreground backdrop-blur-2xl",
        "border border-border/80 dark:border-white/10",
        "transition-shadow duration-300",
        isOpen
          ? "shadow-2xl shadow-black/10 dark:shadow-black/50"
          : "shadow-lg shadow-black/5 dark:shadow-black/30",
        className,
      )}
    >
      <style>{STYLES}</style>

      <div
        role="button"
        tabIndex={0}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
          }
        }}
        className="flex items-center gap-3 p-2.5 cursor-pointer outline-none select-none group"
      >
        <div className="relative shrink-0">
          {avatar ? (
            avatar
          ) : (
            <img
              src={avatarSrc}
              alt="Profile"
              className="size-9 rounded-full object-cover ring-1 ring-border/70 dark:ring-white/15 shadow-xs"
            />
          )}
          {online && (
            <span className="absolute bottom-0 right-0 flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500 ring-2 ring-background dark:ring-zinc-950" />
            </span>
          )}
        </div>

        <div className="flex flex-1 min-w-0 flex-col justify-center">
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans font-medium text-xs sm:text-sm text-foreground truncate">
              {title}
            </span>
          </div>

          {currentStatus && (
            <div className="relative h-4 overflow-hidden text-[11px] font-sans text-muted-foreground mt-0.5">
              <div
                key={statusIndex}
                style={{ animation: "pm-slide-in 0.3s ease-out backwards" }}
                className="absolute inset-0 flex items-center gap-1.5 truncate text-muted-foreground"
              >
                {currentStatus.icon && (
                  <span className="shrink-0 size-3 text-muted-foreground/80 flex items-center justify-center">
                    {currentStatus.icon}
                  </span>
                )}
                <span className="truncate">{currentStatus.text}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-border/70 bg-muted/60 text-[10px] font-mono text-muted-foreground">
            <span>{isApple ? "⌘" : "Ctrl"}</span>
            <span className="uppercase">{shortcutKey}</span>
          </kbd>
          <span
            className={cn(
              "text-muted-foreground/60 transition-transform duration-300 flex items-center justify-center size-4",
              isOpen && "rotate-180 text-foreground",
            )}
          >
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "translate-y-0" : "-translate-y-1.5",
            )}
          >
            <div className="mx-2.5 mb-1.5 h-px bg-border/60 dark:bg-white/10" />

            <div
              ref={panelRef}
              className="relative flex flex-col gap-1 p-2 pt-0"
            >
              <div
                ref={highlightRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 rounded-xl bg-foreground/6 dark:bg-white/10 z-0 opacity-0 transition-[transform,width,height,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />

              {resolvedSections.map((section, sIdx) => (
                <div key={section.label || sIdx} className="space-y-1">
                  {sIdx > 0 && (
                    <div className="my-1.5 mx-1 h-px bg-border/40 dark:bg-white/5" />
                  )}
                  {section.label && (
                    <span className="block px-2.5 pt-1 text-[10px] font-sans font-medium uppercase tracking-wider text-muted-foreground/60 select-none">
                      {section.label}
                    </span>
                  )}
                  <div
                    className={
                      section.grid ? "grid grid-cols-3 gap-1.5" : "space-y-0.5"
                    }
                  >
                    {section.items.map((item) => {
                      const index = items.indexOf(item);
                      return (
                        <button
                          key={item.name}
                          ref={(node) => {
                            itemRefs.current[index] = node;
                          }}
                          type="button"
                          onMouseEnter={() => setSelected(index)}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onSelect?.();
                            if (item.closeOnSelect) {
                              setIsOpen(false);
                              setIsPinned(false);
                            }
                          }}
                          className={cn(
                            "relative z-10 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-sans transition-colors",
                            item.centered
                              ? "justify-center"
                              : "justify-between",
                            item.active
                              ? "text-foreground font-medium ring-1 ring-border/80 dark:ring-white/20 bg-foreground/5 dark:bg-white/5"
                              : "text-muted-foreground hover:text-foreground",
                            item.danger &&
                            "text-rose-500 dark:text-rose-400 hover:text-rose-600",
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-2.5 min-w-0",
                              item.centered && "flex-col gap-1 py-0.5",
                            )}
                          >
                            {item.icon && (
                              <span className="shrink-0 size-4 flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                                {item.icon}
                              </span>
                            )}
                            <span className="truncate">{item.name}</span>
                          </div>

                          {item.shortcut && !item.centered && (
                            <kbd className="font-mono text-[10px] text-muted-foreground/60 px-1 py-0.5 rounded bg-muted/40">
                              {item.shortcut}
                            </kbd>
                          )}

                          {item.badge && !item.centered && (
                            <span className="shrink-0 flex items-center">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M6 20v-1a6 6 0 0 1 12 0v1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" />
      <path
        strokeLinecap="round"
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4 text-emerald-500 dark:text-emerald-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" />
      <path strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn("size-3.5", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
      />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.75 7.5 4.5 4.5-4.5 4.5m6-1.5h4.5"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5 text-muted-foreground/60"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}
