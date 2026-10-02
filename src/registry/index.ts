import { ComponentRegistryItem } from "@/types/component";
import {
  accordion,
  aiInput,
  aiOrb,
  animatedButton,
  asciiHoverButton,
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
  flipClock,
  fileTree,
  focusTestimonials,
  githubActivity,
  glowingBadge,
  gooeyNav,
  hookSidebar,
  liquidMedia,
  liquidToggle,
  macSlider,
  macSwitch,
  morphSearch,
  noise,
  orbitGallery,
  orb,
  otpInput,
  pixelCard,
  profileMenu,
  projectReveal,
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
  segmentedProgress,
  stepper,
} from "./components";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  "flip-clock": flipClock as ComponentRegistryItem,
  "file-upload": fileUpload as ComponentRegistryItem,
  "file-dropzone": fileDropzone as ComponentRegistryItem,
  editor: editor as ComponentRegistryItem,
  scales: scales as ComponentRegistryItem,
  "animated-button": animatedButton as ComponentRegistryItem,
  "ascii-hover-button": asciiHoverButton as ComponentRegistryItem,
  "reveal-sheet": revealSheet as ComponentRegistryItem,
  "spotlight-card": spotlightCard as ComponentRegistryItem,
  dither: dither as ComponentRegistryItem,
  "ai-orb": aiOrb as ComponentRegistryItem,
  "glowing-badge": glowingBadge as ComponentRegistryItem,
  "hook-sidebar": hookSidebar as ComponentRegistryItem,
  "profile-menu": profileMenu as ComponentRegistryItem,
  "project-reveal": projectReveal as ComponentRegistryItem,
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
  "orbit-gallery": orbitGallery as ComponentRegistryItem,
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
  "segmented-progress": segmentedProgress as ComponentRegistryItem,
  stepper: stepper as ComponentRegistryItem,
  "focus-testimonials": focusTestimonials as ComponentRegistryItem,
  "liquid-media": liquidMedia as ComponentRegistryItem,
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
    (slug === "ascii-text-hover" || slug === "text-hover" || slug === "ascii-button"
      ? COMPONENT_REGISTRY["ascii-hover-button"]
      : undefined) ||
    (slug === "liquid-image" || slug === "liquid-video" || slug === "liquid"
      ? COMPONENT_REGISTRY["liquid-media"]
      : undefined) ||
    (slug === "testimonials"
      ? COMPONENT_REGISTRY["focus-testimonials"]
      : undefined) ||
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
