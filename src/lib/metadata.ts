import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_CONFIG.name}: ${SITE_CONFIG.description}`,
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      url: path,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
