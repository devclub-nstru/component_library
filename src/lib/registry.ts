import { getAllComponents, getComponentBySlug } from "@/registry";
import { ComponentRegistryItem } from "@/types/component";

export interface ComponentFilterOptions {
  category?: string;
  query?: string;
  tag?: string;
}

export function fetchComponents(options: ComponentFilterOptions = {}): ComponentRegistryItem[] {
  let items = getAllComponents();

  if (options.category && options.category !== "all") {
    items = items.filter((c) => c.category.toLowerCase() === options.category?.toLowerCase());
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
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return items;
}

export function fetchComponentBySlug(slug: string): ComponentRegistryItem | null {
  return getComponentBySlug(slug) || null;
}

export function getCategoriesList(): string[] {
  const categories = new Set<string>();
  getAllComponents().forEach((c) => categories.add(c.category));
  return Array.from(categories);
}
