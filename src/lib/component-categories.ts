import type { ComponentCategory } from "@/types/component";

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
    value: "charts-and-graphs",
    label: "Charts & graphs",
    description: "Interactive charts and visual data exploration.",
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
