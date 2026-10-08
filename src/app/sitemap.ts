import type { MetadataRoute } from "next";
import { getAllComponents } from "@/registry";
import { DOCS_NAV, SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const docsPaths = DOCS_NAV.flatMap((section) =>
    section.items.map((item) => item.href),
  );
  const staticPaths = ["/", "/components", ...docsPaths, "/privacy", "/terms"];

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_CONFIG.url}${path === "/" ? "" : path}`,
  }));

  const componentEntries = getAllComponents().map((component) => ({
    url: `${SITE_CONFIG.url}/components/${component.slug}`,
    lastModified: component.updatedDate,
  }));

  return [...staticEntries, ...componentEntries];
}
