"use client";

export type PromptActionId = "image" | "note" | "event" | "voice" | "docs";

export function PromptComposerArt({ id }: { id: PromptActionId }) {
  if (id === "note")
    return (
      <span className="relative mt-[1cqw] flex w-[72%] -rotate-3 flex-col gap-[1.5cqw] rounded-[1cqw] border border-current/15 bg-[var(--pc-paper)]/50 px-[1cqw] py-[1.5cqw] shadow-[2px_3px_0_#00000006]">
        {[0.7, 1, 0.9, 0.55].map((width, index) => (
          <span
            key={index}
            data-art-line
            className="h-[1.5px] origin-left rounded-full bg-current opacity-55"
            style={{ width: `${width * 100}%` }}
          />
        ))}
        <span className="absolute -top-[0.7cqw] right-[1.2cqw] h-[1.4cqw] w-[4.5cqw] rotate-8 rounded-sm bg-current/15" />
      </span>
    );

  if (id === "event")
    return (
      <span
        data-art-date
        className="relative flex w-[66%] flex-col items-center rounded-[1cqw] border border-current/15 bg-[var(--pc-paper)]/55 pb-[1cqw] shadow-[2px_3px_0_#00000006]"
      >
        <span className="w-full border-b border-current/10 py-[0.5cqw] text-center text-[1.3cqw] font-semibold tracking-[0.15em]">
          OCT
        </span>
        <span className="text-[6cqw] leading-[1.15] font-semibold tracking-[-0.08em]">
          12
        </span>
        <span className="absolute -top-[0.7cqw] left-[1.2cqw] h-[1.3cqw] w-[0.45cqw] rounded-full bg-current/50" />
        <span className="absolute -top-[0.7cqw] right-[1.2cqw] h-[1.3cqw] w-[0.45cqw] rounded-full bg-current/50" />
      </span>
    );

  if (id === "voice")
    return (
      <svg
        className="w-[78%] overflow-visible"
        viewBox="0 0 96 80"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="9"
          y="11"
          width="78"
          height="55"
          rx="15"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeOpacity="0.12"
        />
        {[14, 27, 39, 24, 47, 32, 18].map((height, index) => (
          <rect
            key={index}
            data-art-wave
            x={22 + index * 8}
            y={39 - height / 2}
            width="4"
            height={height}
            rx="2"
            fill="currentColor"
            fillOpacity={index === 3 ? 0.9 : 0.45}
          />
        ))}
        <circle data-art-dot cx="76" cy="63" r="9" fill="var(--pc-paper)" />
        <circle cx="76" cy="63" r="4" fill="currentColor" />
      </svg>
    );

  if (id === "docs")
    return (
      <svg
        className="w-[74%] overflow-visible"
        viewBox="0 0 96 80"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="20"
          y="9"
          width="49"
          height="60"
          rx="7"
          transform="rotate(-9 20 9)"
          fill="currentColor"
          fillOpacity="0.13"
        />
        <g data-art-doc>
          <rect
            x="27"
            y="8"
            width="49"
            height="61"
            rx="7"
            fill="var(--pc-paper)"
            fillOpacity="0.65"
            stroke="currentColor"
            strokeOpacity="0.2"
          />
          <rect
            x="37"
            y="21"
            width="16"
            height="5"
            rx="2.5"
            fill="currentColor"
            fillOpacity="0.55"
          />
          <path
            d="M37 36h29M37 44h29M37 52h17"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <circle cx="72" cy="63" r="11" fill="currentColor" fillOpacity="0.8" />
        <path
          d="m67 63 3 3 6-7"
          stroke="var(--pc-paper)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <svg
      className="w-[80%] overflow-visible"
      viewBox="0 0 96 80"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="13"
        y="12"
        width="65"
        height="50"
        rx="8"
        transform="rotate(-8 13 12)"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <g data-art-triangle>
        <rect
          x="19"
          y="15"
          width="65"
          height="50"
          rx="8"
          fill="var(--pc-paper)"
          fillOpacity="0.65"
          stroke="currentColor"
          strokeOpacity="0.2"
        />
        <path
          d="m25 56 16-19 12 13 8-9 17 15H25Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
      </g>
      <circle
        data-art-circle
        cx="66"
        cy="29"
        r="6"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path
        data-art-spark
        d="M81 2c1 7 3 9 10 10-7 1-9 3-10 10-1-7-3-9-10-10 7-1 9-3 10-10Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
    </svg>
  );
}
