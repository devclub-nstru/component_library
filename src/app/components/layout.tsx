import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Components",
  description:
    "Browse animated React components built with Tailwind CSS v4, GSAP and WebGL. Every component is a single file you own.",
  path: "/components",
});

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
