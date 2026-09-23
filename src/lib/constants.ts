export const SITE_CONFIG = {
  name: "DevClub UI",
  description: "High performance UI components engineered for speed and visual excellence.",
  url: "https://devclub.co",
  ogImage: "https://wallpapercave.com/wp/wp4140937.jpg",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    discord: "https://discord.gg",
  },
};

export const NAV_ITEMS = [
  { label: "Components", href: "/components" },
  { label: "Docs", href: "/docs" },
];

export const CATEGORIES = [
  { id: "all", label: "All Components" },
  { id: "accordion", label: "Accordions" },
  { id: "scales", label: "Scales & Borders" },
  { id: "buttons", label: "Buttons & Actions" },
  { id: "cards", label: "Cards & Bento" },
  { id: "feedback", label: "Badges & Feedback" },
  { id: "layout", label: "Layout & Grids" },
  { id: "ai-stuff", label: "AI Stuff" },
];

export interface DocsNavItem {
  title: string;
  href: string;
  badge?: string;
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export const DOCS_NAV: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Design System",
    items: [
      { title: "Theming", href: "/docs/theming" },
      { title: "Typeset", href: "/docs/typeset" },
    ],
  },
  {
    title: "Tooling & Platform",
    items: [
      { title: "CLI", href: "/docs/cli" },
      { title: "Skills", href: "/docs/skills", badge: "Agentic" },
      { title: "Registry", href: "/docs/registry", badge: "v1.0" },
    ],
  },
];

