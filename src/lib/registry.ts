import { getAllComponents, getComponentBySlug } from "@/registry";
import type {
  ComponentCategory,
  ComponentRegistryItem,
} from "@/types/component";

export const COMPONENT_CATEGORIES: {
  value: ComponentCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "buttons",
    label: "Buttons & actions",
    description: "Animated buttons and clear action states.",
  },
  {
    value: "inputs",
    label: "Inputs & forms",
    description: "Text entry, verification and file uploads.",
  },
  {
    value: "search",
    label: "Search & commands",
    description: "Search fields, command menus and quick discovery.",
  },
  {
    value: "navbar",
    label: "Navbar",
    description: "Responsive navigation bars with smooth expanding panels.",
  },
  {
    value: "navigation",
    label: "Navigation",
    description: "Sidebars, menus and file navigation.",
  },
  {
    value: "sliders-and-toggles",
    label: "Sliders & toggles",
    description: "Range controls, switches and theme selection.",
  },
  {
    value: "menus",
    label: "Menus & overlays",
    description: "Profile menus, sheets and contextual panels.",
  },
  {
    value: "cards",
    label: "Cards & testimonials",
    description: "Content cards, social previews and testimonials.",
  },
  {
    value: "galleries-and-media",
    label: "Galleries & media",
    description: "Interactive galleries, project reveals and image effects.",
  },
  {
    value: "page-transitions",
    label: "Page Transitions",
    description: "Coordinated scene changes for portfolios and immersive pages.",
  },
  {
    value: "ai-stuff",
    label: "AI & editors",
    description: "AI inputs, visual orbs and editing experiences.",
  },
  {
    value: "display",
    label: "Data & display",
    description: "Counters, activity, code and structured information.",
  },
  {
    value: "backgrounds-and-effects",
    label: "Backgrounds & effects",
    description: "Generative textures and atmospheric backgrounds.",
  },
  {
    value: "feedback",
    label: "Feedback & progress",
    description: "Notifications, status and step-by-step progress.",
  },
  {
    value: "loaders",
    label: "Loaders",
    description: "Loading sequences and animated content reveals.",
  },
  {
    value: "accordion",
    label: "Accordions",
    description: "Expandable sections with carefully tuned motion.",
  },
  {
    value: "clocks-and-timers",
    label: "Clocks & timers",
    description: "Live clocks, countdowns and time-based displays.",
  },
  {
    value: "date-and-time",
    label: "Date & time",
    description: "Calendar controls and date selection.",
  },
  {
    value: "layout",
    label: "Layout",
    description: "Composable grids and page structure.",
  },
];

export function getCategoryLabel(category: string): string {
  return (
    COMPONENT_CATEGORIES.find((item) => item.value === category)?.label ??
    category.replaceAll("-", " ")
  );
}

export function getComponentCategories(components = getAllComponents()) {
  return COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    items: components
      .filter((item) => !item.hidden && item.category === category.value)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((category) => category.items.length > 0);
}

export interface ComponentFilterOptions {
  category?: string;
  query?: string;
  tag?: string;
}

export function fetchComponents(
  options: ComponentFilterOptions = {},
): ComponentRegistryItem[] {
  let items = getAllComponents();

  if (options.category && options.category !== "all") {
    items = items.filter(
      (c) => c.category.toLowerCase() === options.category?.toLowerCase(),
    );
  }

  if (options.tag) {
    items = items.filter((c) => c.tags.includes(options.tag!));
  }

  if (options.query) {
    const q = options.query.toLowerCase().trim();
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        getCategoryLabel(c.category).toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return items;
}

export function fetchComponentBySlug(
  slug: string,
): ComponentRegistryItem | null {
  return getComponentBySlug(slug) || null;
}

export function getCategoriesList(): string[] {
  return getComponentCategories().map((category) => category.value);
}
