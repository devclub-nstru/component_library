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
  confirmMorph,
  dither,
  dottedAccordion,
  editor,
  fileUpload,
  fileDropzone,
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
  profileMenu,
  proximitySidebar,
  revealSheet,
  scales,
  searchInput,
  slider,
  smoothAccordion,
  sparkleButton,
  spotlightCard,
  spotlightSearch,
  taskList,
  themeToggle,
  toast,
  twitterCard,
  dateRangePicker,
} from "./components";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  "file-upload": fileUpload as ComponentRegistryItem,
  "file-dropzone": fileDropzone as ComponentRegistryItem,
  editor: editor as ComponentRegistryItem,
  scales: scales as ComponentRegistryItem,
  "animated-button": animatedButton as ComponentRegistryItem,
  "reveal-sheet": revealSheet as ComponentRegistryItem,
  "spotlight-card": spotlightCard as ComponentRegistryItem,
  dither: dither as ComponentRegistryItem,
  "ai-orb": aiOrb as ComponentRegistryItem,
  "glowing-badge": glowingBadge as ComponentRegistryItem,
  "hook-sidebar": hookSidebar as ComponentRegistryItem,
  "profile-menu": profileMenu as ComponentRegistryItem,
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
  slider: slider as ComponentRegistryItem,
  "spotlight-search": spotlightSearch as ComponentRegistryItem,
  "pixel-card": pixelCard as ComponentRegistryItem,
  "theme-toggle": themeToggle as ComponentRegistryItem,
  "confirm-morph": confirmMorph as ComponentRegistryItem,
  "date-range-picker": dateRangePicker as ComponentRegistryItem,
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
    (slug === "morph-selection"
      ? COMPONENT_REGISTRY["confirm-morph"]
      : undefined) ||
    (slug === "animated-theme-toggler" || slug === "theme-toggler"
      ? COMPONENT_REGISTRY["theme-toggle"]
      : undefined);
  if (!item) return undefined;
  if (item.hidden && !includeHidden) return undefined;
  return item;
};
