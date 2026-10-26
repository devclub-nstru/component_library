import { cn } from "@/lib/utils";

const paths = {
  slack: [
    "M12 12v-6a2 2 0 0 1 4 0v6m0 -2a2 2 0 1 1 2 2h-6",
    "M12 12h6a2 2 0 0 1 0 4h-6m2 0a2 2 0 1 1 -2 2v-6",
    "M12 12v6a2 2 0 0 1 -4 0v-6m0 2a2 2 0 1 1 -2 -2h6",
    "M12 12h-6a2 2 0 0 1 0 -4h6m-2 0a2 2 0 1 1 2 -2v6",
  ],
  x: [
    "M4 4l11.733 16h4.267l-11.733 -16l-4.267 0",
    "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772",
  ],
  notion: [
    "M11 17.5v-6.5h.5l4 6h.5v-6.5",
    "M19.077 20.071l-11.53 .887a1 1 0 0 1 -.876 -.397l-2.471 -3.294a1 1 0 0 1 -.2 -.6v-10.741a1 1 0 0 1 .923 -.997l11.389 -.876a2 2 0 0 1 1.262 .33l1.535 1.023a2 2 0 0 1 .891 1.664v12.004a1 1 0 0 1 -.923 .997",
    "M4.5 5.5l2.5 2.5",
    "M20 7l-13 1v12.5",
  ],
  wikipedia: [
    "M3 4.984h2",
    "M8 4.984h2.5",
    "M14.5 4.984h2.5",
    "M22 4.984h-2",
    "M4 4.984l5.455 14.516l6.545 -14.516",
    "M9 4.984l6 14.516l6 -14.516",
  ],
  google: [
    "M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z",
  ],
  booking: [
    "M4 18v-9.5a4.5 4.5 0 0 1 4.5 -4.5h7a4.5 4.5 0 0 1 4.5 4.5v7a4.5 4.5 0 0 1 -4.5 4.5h-9.5a2 2 0 0 1 -2 -2",
    "M8 12h3.5a2 2 0 1 1 0 4h-3.5v-7a1 1 0 0 1 1 -1h1.5a2 2 0 1 1 0 4h-1.5",
    "M16 16l.01 0",
  ],
  airbnb: [
    "M12 10c-2 0 -3 1 -3 3c0 1.5 1.494 3.535 3 5.5c1 1 1.5 1.5 2.5 2s2.5 1 4.5 -.5s1.5 -3.5 .5 -6s-2.333 -5.5 -5 -9.5c-.834 -1 -1.5 -1.5 -2.503 -1.5c-1 0 -1.623 .45 -2.497 1.5c-2.667 4 -4 7 -5 9.5s-1.5 4.5 .5 6s3.5 1 4.5 .5s1.5 -1 2.5 -2c1.506 -1.965 3 -4 3 -5.5c0 -2 -1 -3 -3 -3",
  ],
} as const;

const colors = {
  slack: "text-[#611f69]",
  x: "rounded-[3px] bg-zinc-950 p-px text-white",
  notion: "rounded-[3px] bg-white text-zinc-950",
  wikipedia: "text-zinc-700 dark:text-zinc-200",
  google: "text-[#4285f4]",
  booking: "rounded-[3px] bg-[#003b95] p-px text-white",
  airbnb: "text-[#ff5a5f]",
} as const;

const slackColors = ["#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a"];

export function ThinkingSourceLogo({ brand }: { brand: keyof typeof paths }) {
  return (
    <svg
      data-brand-logo={brand}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={brand === "google" ? "currentColor" : "none"}
      stroke={brand === "google" ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", colors[brand])}
    >
      {paths[brand].map((d, index) => (
        <path
          key={d}
          d={d}
          stroke={brand === "slack" ? slackColors[index] : undefined}
        />
      ))}
    </svg>
  );
}
