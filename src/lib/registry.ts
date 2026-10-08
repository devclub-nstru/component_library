import { getAllComponents, getComponentBySlug } from "@/registry";
import { COMPONENT_CATEGORIES } from "@/lib/component-categories";
import type { ComponentRegistryItem } from "@/types/component";

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
