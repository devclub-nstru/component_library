import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const NOT_FOUND_LINKS = [
  { href: "/", label: "Home", description: "Back to the start." },
  {
    href: "/components",
    label: "Components",
    description: "Browse the full component library.",
  },
  {
    href: "/docs",
    label: "Documentation",
    description: "Installation, theming, CLI and registry guides.",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <main
        id="main-content"
        className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-24 font-sans"
      >
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground font-light leading-relaxed">
          The page you were looking for does not exist or has moved.
        </p>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {NOT_FOUND_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col gap-1.5 rounded-2xl border border-border/80 bg-card/40 p-4 transition-all hover:border-foreground/20 hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <span className="flex items-center justify-between text-sm font-medium text-foreground">
                  {link.label}
                  <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-xs text-muted-foreground font-light leading-relaxed">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
