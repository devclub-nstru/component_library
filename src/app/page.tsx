import { Navbar } from "@/components/layout/navbar";
import HeroSection from "@/components/hero-section";
import { LandingScrollStory } from "@/components/landing-scroll-story";
import { LandingComponentsSection } from "@/components/landing-components-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar showThemeToggle />
      <main id="main-content" className="flex-1 flex flex-col">
        <HeroSection />
        <LandingScrollStory />
        <LandingComponentsSection />
      </main>
    </div>
  );
}
