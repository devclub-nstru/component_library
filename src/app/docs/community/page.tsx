import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Find DevClub UI support, contribution guidance, community standards, and package updates.",
  alternates: { canonical: "/docs/community" },
};

const sections = [
  { id: "explore", title: "Explore the library" },
  { id: "get-help", title: "Get help" },
  { id: "contribute", title: "Contribute" },
  { id: "stay-up-to-date", title: "Stay up to date" },
  { id: "community-standards", title: "Community standards" },
];

const linkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm";

export default function DocsCommunityPage() {
  return (
    <article className="max-w-2xl space-y-10 font-sans">
      <header className="space-y-3 border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Community
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground font-light leading-relaxed">
          Build with DevClub UI, share what you learn, and help shape what comes
          next. Here&apos;s where to find support, contribute, and follow updates.
        </p>
      </header>

      <nav aria-label="On this page" className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">On this page</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs sm:text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className={linkClassName}>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="explore" className="scroll-mt-24 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Explore the library
        </h2>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Browse the{" "}
          <Link href="/components" className={linkClassName}>
            component library
          </Link>{" "}
          for live previews and editable source. The{" "}
          <Link href="/docs/installation" className={linkClassName}>
            installation guide
          </Link>{" "}
          covers copying source and adding components with the CLI.
        </p>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Our official npm package is{" "}
          <a href={SITE_CONFIG.links.npm} className={linkClassName}>
            @devclubnst/ui
          </a>
          . It includes the CLI and component registry. For the registry format
          and endpoints, see the{" "}
          <Link href="/docs/registry" className={linkClassName}>
            registry documentation
          </Link>
          .
        </p>
      </section>

      <section id="get-help" className="scroll-mt-24 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Get help
        </h2>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          For setup questions, bug reports, or component ideas, email{" "}
          <a href={SITE_CONFIG.links.email} className={`${linkClassName} break-words`}>
            softwaredevg.club@rishihood.edu.in
          </a>
          . Include the component name, package version, what you expected, and a
          small reproduction when possible.
        </p>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          If you have repository access, check{" "}
          <a href={`${SITE_CONFIG.links.github}/issues`} className={linkClassName}>
            existing issues
          </a>{" "}
          before opening a report. Use the issue templates to keep bug reports
          and feature requests easy to follow.
        </p>
      </section>

      <section id="contribute" className="scroll-mt-24 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Contribute
        </h2>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Contributions can start small: improve an example, clarify the docs,
          test keyboard behavior, or share a reproducible bug. New component
          proposals are welcome too.
        </p>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Read the{" "}
          <a
            href={`${SITE_CONFIG.links.github}/blob/main/CONTRIBUTING.md`}
            className={linkClassName}
          >
            contribution guide
          </a>{" "}
          for local setup, component conventions, registry updates, and checks
          before a pull request. You can review ongoing work in{" "}
          <a href={`${SITE_CONFIG.links.github}/pulls`} className={linkClassName}>
            pull requests
          </a>
          .
        </p>
        <p className="border-l-2 border-border pl-4 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          The GitHub repository is currently private. Repository links require
          access; the docs and npm package are public. To request contributor
          access or suggest a change, contact us by{" "}
          <a href={SITE_CONFIG.links.email} className={linkClassName}>
            email
          </a>
          .
        </p>
      </section>

      <section id="stay-up-to-date" className="scroll-mt-24 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Stay up to date
        </h2>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Find published versions on{" "}
          <a
            href={`${SITE_CONFIG.links.npm}?activeTab=versions`}
            className={linkClassName}
          >
            npm
          </a>
          . Contributors with repository access can read{" "}
          <a href={`${SITE_CONFIG.links.github}/releases`} className={linkClassName}>
            GitHub releases
          </a>{" "}
          and use GitHub&apos;s Watch menu to subscribe to release notifications.
        </p>
      </section>

      <section id="community-standards" className="scroll-mt-24 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Community standards
        </h2>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Keep feedback constructive and treat other contributors with respect.
          Our{" "}
          <a
            href={`${SITE_CONFIG.links.github}/blob/main/CODE_OF_CONDUCT.md`}
            className={linkClassName}
          >
            Code of Conduct
          </a>{" "}
          describes the expectations for participation and how to report concerns.
        </p>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Report security concerns privately by{" "}
          <a href={SITE_CONFIG.links.email} className={linkClassName}>
            email
          </a>
          . Please avoid sharing vulnerability details in a public issue. See the{" "}
          <a
            href={`${SITE_CONFIG.links.github}/blob/main/SECURITY.md`}
            className={linkClassName}
          >
            security policy
          </a>{" "}
          for reporting guidance.
        </p>
      </section>
    </article>
  );
}
