import { ScrollText } from "@/registry/ui/scroll-text";

export function LandingScrollStory() {
  return (
    <section
      aria-labelledby="scroll-story-heading"
      className="relative flex justify-center bg-[#f7f7f2] px-6 pb-[max(10rem,25svh)] pt-10 text-foreground dark:bg-black sm:px-10 sm:pt-14"
    >
      <h2 id="scroll-story-heading" className="sr-only">
        Interfaces with a pulse
      </h2>
      <ScrollText
        text="DevClub UI brings tactile components, thoughtful motion, and details worth slowing down for. Make every hover, click, and transition feel intentional. We’ll leave the identical rectangles to everyone else."
        highlightWords={["tactile", "motion", "intentional"]}
        accentColor="#0080fc"
        effect="mosaic"
        dimOpacity={0.24}
        scrub={0.65}
        stagger={0.13}
        rise={4}
        start="top 90%"
        end="bottom 80%"
        className="w-full max-w-4xl font-serif text-[clamp(26px,2.8vw,40px)] font-normal leading-[1.35] tracking-[-0.03em]"
      />
    </section>
  );
}
