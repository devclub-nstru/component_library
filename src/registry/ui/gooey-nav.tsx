"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const SPRING_TUNING = {
  fluid: { stiffness: 220, damping: 24, mass: 0.9 },
  elastic: { stiffness: 320, damping: 18, mass: 1 },
} as const;

const NECK_BREAK = 0.44;
const NECK_H = 100;

const SIZES = {
  xs: {
    label: "gap-1.5 px-3 py-1.5 text-[11px] leading-4 [&_svg]:size-3.5",
    radius: 8,
    separation: 14,
  },
  sm: {
    label: "gap-2 px-3.5 py-2 text-xs leading-4 [&_svg]:size-4",
    radius: 10,
    separation: 16,
  },
  md: {
    label: "gap-2.5 px-5 py-2.5 text-sm leading-5 [&_svg]:size-4.5",
    radius: 12,
    separation: 20,
  },
  lg: {
    label: "gap-3 px-6 py-3 text-base leading-6 [&_svg]:size-5",
    radius: 14,
    separation: 24,
  },
} as const;

export type GooeyNavSize = keyof typeof SIZES;
export type GooeyNavElasticity = keyof typeof SPRING_TUNING;
export type GooeyNavVariant = "solid" | "glow" | "glass";

export type GooeyNavColor =
  | "orange"
  | "emerald"
  | "violet"
  | "cyan"
  | "amber"
  | "monochrome";

const COLOR_PRESETS: Record<
  GooeyNavColor,
  { hex: string; text: string; glow: string; dot: string }
> = {
  orange: {
    hex: "#FC4C01",
    text: "#ffffff",
    glow: "rgba(252,76,1,0.35)",
    dot: "bg-[#FC4C01]",
  },
  emerald: {
    hex: "#10B981",
    text: "#ffffff",
    glow: "rgba(16,185,129,0.35)",
    dot: "bg-emerald-400",
  },
  violet: {
    hex: "#8B5CF6",
    text: "#ffffff",
    glow: "rgba(139,92,246,0.35)",
    dot: "bg-violet-400",
  },
  cyan: {
    hex: "#06B6D4",
    text: "#ffffff",
    glow: "rgba(6,182,212,0.35)",
    dot: "bg-cyan-400",
  },
  amber: {
    hex: "#F59E0B",
    text: "#ffffff",
    glow: "rgba(245,158,11,0.35)",
    dot: "bg-amber-400",
  },
  monochrome: {
    hex: "#F4F4F5",
    text: "#09090b",
    glow: "rgba(244,244,245,0.25)",
    dot: "bg-zinc-200",
  },
};

export type GooeyNavItemObject = {
  label: string;
  href?: string;
  icon?: ReactNode;
  id?: string;
};

export type GooeyNavItem = string | GooeyNavItemObject;

const toItem = (item: GooeyNavItem): GooeyNavItemObject =>
  typeof item === "string" ? { label: item } : item;

export type GooeyNavProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: GooeyNavItem[];
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  size?: GooeyNavSize;
  color?: GooeyNavColor;
  activeColor?: string;
  activeLabelColor?: string;
  variant?: GooeyNavVariant;
  elasticity?: GooeyNavElasticity;
  separation?: number;
  radius?: number;
};

function neckPath(gap: number, span: number, breakRatio = NECK_BREAK) {
  if (
    !Number.isFinite(gap) ||
    !Number.isFinite(span) ||
    gap <= 0 ||
    span <= 0
  ) {
    return "";
  }
  const progress = gap / (span * breakRatio);
  if (progress >= 1) return "";
  const waist = NECK_H * Math.pow(1 - progress, 1.4);
  if (waist <= 0.2) return "";
  const start = span - gap;
  const mid = start + gap / 2;
  const dip = (NECK_H - waist) / 2;
  return `M${start} 0 Q${mid} ${dip} ${span} 0 L${span} ${NECK_H} Q${mid} ${NECK_H - dip} ${start} ${NECK_H} Z`;
}

type SegmentProps = {
  gap: number;
  span: number;
  hasSeam: boolean;
  leftFill: string;
  rightFill: string;
  reduced: boolean;
  radii: Record<string, number>;
  springConfig: { stiffness: number; damping: number; mass: number };
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function Segment({
  gap,
  span,
  hasSeam,
  leftFill,
  rightFill,
  reduced,
  radii,
  springConfig,
  className,
  style,
  children,
}: SegmentProps) {
  const marginLeft = useSpring(gap, springConfig);
  const gradientId = `gooey-neck-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (reduced) marginLeft.jump(gap);
    else marginLeft.set(gap);
  }, [gap, marginLeft, reduced]);

  const d = useTransform(marginLeft, (g) => neckPath(g, span));

  return (
    <motion.li
      data-slot="gooey-nav-segment"
      className={cn("relative list-none", className)}
      style={{ ...style, marginLeft }}
      initial={false}
      animate={radii}
      transition={
        reduced ? { duration: 0 } : { type: "spring", ...springConfig }
      }
    >
      {hasSeam && (
        <svg
          aria-hidden="true"
          width={span}
          viewBox={`0 0 ${span} ${NECK_H}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 right-full h-full overflow-visible text-[#18181b]"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={leftFill} />
              <stop offset="100%" stopColor={rightFill} />
            </linearGradient>
          </defs>
          <motion.path d={d} fill={`url(#${gradientId})`} />
        </svg>
      )}
      {children}
    </motion.li>
  );
}

type NavLabelProps = GooeyNavItemObject & {
  isActive: boolean;
  size: GooeyNavSize;
  activeLabelColor: string;
  onSelect: () => void;
  tabIndex: number;
  id: string;
};

function NavLabel({
  label,
  href,
  icon,
  isActive,
  size,
  activeLabelColor,
  onSelect,
  tabIndex,
  id,
}: NavLabelProps) {
  const props = {
    id,
    role: "tab",
    "aria-selected": isActive,
    tabIndex,
    "data-slot": "gooey-nav-item",
    "data-active": isActive,
    className: cn(
      "relative z-10 flex cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none transition-all duration-300 ease-out select-none active:scale-95 focus-visible:ring-1 focus-visible:ring-white/30",
      SIZES[size].label,
      isActive
        ? "opacity-100"
        : "text-zinc-400 hover:text-white opacity-80 hover:opacity-100",
    ),
    style: isActive ? { color: activeLabelColor } : undefined,
    onClick: onSelect,
  } as const;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </>
  );

  return href ? (
    <Link href={href} {...props}>
      {content}
    </Link>
  ) : (
    <button type="button" {...props}>
      {content}
    </button>
  );
}

export function GooeyNav({
  items,
  value,
  defaultValue = 0,
  onChange,
  size = "md",
  color = "orange",
  activeColor: customActiveColor,
  activeLabelColor: customActiveLabelColor,
  variant = "solid",
  elasticity = "fluid",
  separation,
  radius,
  className,
  ...props
}: GooeyNavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const navRef = useRef<HTMLElement>(null);

  const routeIndex = items.findIndex((item) => toItem(item).href === pathname);
  const [uncontrolled, setUncontrolled] = useState(() =>
    routeIndex === -1 ? defaultValue : routeIndex,
  );
  const [seenRoute, setSeenRoute] = useState(routeIndex);

  if (routeIndex !== seenRoute) {
    setSeenRoute(routeIndex);
    if (routeIndex !== -1 && value === undefined) setUncontrolled(routeIndex);
  }

  const active = Math.max(0, Math.min(items.length - 1, value ?? uncontrolled));
  const span = separation ?? SIZES[size].separation;
  const corner = radius ?? SIZES[size].radius;
  const springConfig = SPRING_TUNING[elasticity];

  const preset = COLOR_PRESETS[color] ?? COLOR_PRESETS.orange;
  const computedActiveColor = customActiveColor ?? preset.hex;
  const computedLabelColor = customActiveLabelColor ?? preset.text;

  const open = (seam: number) =>
    seam === 0 ||
    seam === items.length ||
    seam - 1 === active ||
    seam === active;

  const baseSurface =
    variant === "glass"
      ? "bg-white/6 backdrop-blur-md border border-white/10"
      : "bg-[#18181b] border border-white/8";

  const fill = (i: number) => (i === active ? computedActiveColor : "#18181b");

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (active + 1) % items.length;
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (active - 1 + items.length) % items.length;
      if (value === undefined) setUncontrolled(prev);
      onChange?.(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (value === undefined) setUncontrolled(0);
      onChange?.(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = items.length - 1;
      if (value === undefined) setUncontrolled(last);
      onChange?.(last);
    }
  };

  return (
    <nav
      ref={navRef}
      data-slot="gooey-nav"
      className={cn("inline-block select-none", className)}
      {...props}
    >
      <ul
        role="tablist"
        onKeyDown={handleKeyDown}
        className="flex items-center m-0 p-0 list-none"
      >
        {items.map((item, i) => {
          const navItem = toItem(item);
          const isActive = i === active;
          const itemId = navItem.id ?? `gooey-tab-${i}`;

          return (
            <Segment
              key={`${i}-${navItem.label}`}
              gap={i === 0 ? 0 : open(i) ? span : -1}
              span={span}
              hasSeam={i > 0}
              leftFill={fill(i - 1)}
              rightFill={fill(i)}
              reduced={reduced}
              springConfig={springConfig}
              radii={{
                borderTopLeftRadius: open(i) ? corner : 0,
                borderBottomLeftRadius: open(i) ? corner : 0,
                borderTopRightRadius: open(i + 1) ? corner : 0,
                borderBottomRightRadius: open(i + 1) ? corner : 0,
              }}
              className={cn(
                "transition-all duration-300 ease-out",
                baseSurface,
                isActive &&
                  variant === "glow" &&
                  "shadow-[0_0_24px_var(--glow-color)]",
              )}
              style={
                {
                  "--glow-color": preset.glow,
                  backgroundColor: isActive ? computedActiveColor : undefined,
                  borderColor: isActive ? "transparent" : undefined,
                } as CSSProperties
              }
            >
              <NavLabel
                {...navItem}
                id={itemId}
                isActive={isActive}
                size={size}
                activeLabelColor={computedLabelColor}
                tabIndex={isActive ? 0 : -1}
                onSelect={() => {
                  if (value === undefined) setUncontrolled(i);
                  onChange?.(i);
                }}
              />
            </Segment>
          );
        })}
      </ul>
    </nav>
  );
}

export default GooeyNav;
