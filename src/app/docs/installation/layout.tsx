import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Installation",
  description:
    "Set up React 19, Tailwind CSS v4 and shadcn, then add DevClub UI components with the shadcn CLI or the DevClub CLI.",
  path: "/docs/installation",
});

export default function DocsInstallationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
