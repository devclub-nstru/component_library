import { ComponentRegistryItem } from "@/types/component";
import {
  accordion,
  aiInput,
  aiOrb,
  animatedButton,
  animatedCounter,
  bentoGrid,
  candyButton,
  codeBlock,
  dither,
  dottedAccordion,
  fileTree,
  githubActivity,
  glowingBadge,
  gooeyNav,
  hookSidebar,
  liquidToggle,
  macSlider,
  macSwitch,
  morphSearch,
  noise,
  orb,
  otpInput,
  pixelCard,
  proximitySidebar,
  scales,
  searchInput,
  smoothAccordion,
  sparkleButton,
  spotlightCard,
  spotlightSearch,
  taskList,
  themeToggle,
  toast,
  twitterCard,
} from "./components";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  scales: scales as ComponentRegistryItem,
  "animated-button": animatedButton as ComponentRegistryItem,
  "spotlight-card": spotlightCard as ComponentRegistryItem,
  dither: dither as ComponentRegistryItem,
  "ai-orb": aiOrb as ComponentRegistryItem,
  "glowing-badge": glowingBadge as ComponentRegistryItem,
  "hook-sidebar": hookSidebar as ComponentRegistryItem,
  "proximity-sidebar": proximitySidebar as ComponentRegistryItem,
  "github-activity": githubActivity as ComponentRegistryItem,
  "bento-grid": bentoGrid as ComponentRegistryItem,
  "animated-counter": animatedCounter as ComponentRegistryItem,
  "candy-button": candyButton as ComponentRegistryItem,
  "sparkle-button": sparkleButton as ComponentRegistryItem,
  "otp-input": otpInput as ComponentRegistryItem,
  "code-block": codeBlock as ComponentRegistryItem,
  "smooth-accordion": smoothAccordion as ComponentRegistryItem,
  accordion: accordion as ComponentRegistryItem,
  "dotted-accordion": dottedAccordion as ComponentRegistryItem,
  "twitter-card": twitterCard as ComponentRegistryItem,
  toast: toast as ComponentRegistryItem,
  "task-list": taskList as ComponentRegistryItem,
  "file-tree": fileTree as ComponentRegistryItem,
  "search-input": searchInput as ComponentRegistryItem,
  "morph-search": morphSearch as ComponentRegistryItem,
  orb: orb as ComponentRegistryItem,
  "liquid-toggle": liquidToggle as ComponentRegistryItem,
  "gooey-nav": gooeyNav as ComponentRegistryItem,
  noise: noise as ComponentRegistryItem,
  "ai-input": aiInput as ComponentRegistryItem,
  "mac-slider": macSlider as ComponentRegistryItem,
  "mac-switch": macSwitch as ComponentRegistryItem,
  "spotlight-search": spotlightSearch as ComponentRegistryItem,
  "pixel-card": pixelCard as ComponentRegistryItem,
  "theme-toggle": themeToggle as ComponentRegistryItem,
};

export const getAllComponents = (
  includeHidden = false
): ComponentRegistryItem[] => {
  const items = Object.values(COMPONENT_REGISTRY);
  if (includeHidden) return items;
  return items.filter((item) => !item.hidden);
};

export const getComponentBySlug = (
  slug: string,
  includeHidden = false
): ComponentRegistryItem | undefined => {
  const item =
    COMPONENT_REGISTRY[slug] ||
    (slug === "animated-theme-toggler" || slug === "theme-toggler"
      ? COMPONENT_REGISTRY["theme-toggle"]
      : undefined);
  if (!item) return undefined;
  if (item.hidden && !includeHidden) return undefined;
  return item;
};
