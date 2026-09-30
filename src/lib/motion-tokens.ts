export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    standard: 0.35,
    considered: 0.5,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
  },
  spring: {
    smooth: { type: "spring" as const, bounce: 0, visualDuration: 0.4 },
    snappy: { type: "spring" as const, bounce: 0.15, visualDuration: 0.35 },
  },
  blur: {
    soft: 4,
    subtle: 2,
  },
  stagger: {
    item: 0.05,
  },
};
