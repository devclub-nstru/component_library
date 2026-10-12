const sideButtons = [
  { side: "left", top: 118, height: 30 },
  { side: "left", top: 172, height: 56 },
  { side: "left", top: 240, height: 56 },
  { side: "right", top: 196, height: 90 },
] as const;

export function PhoneSideButtons() {
  return (
    <>
      {sideButtons.map(({ side, top, height }) => (
        <span
          key={`${side}-${top}`}
          aria-hidden
          className={
            side === "left"
              ? "absolute -left-[15px] w-[3px] rounded-l-[2px] bg-zinc-700 dark:bg-zinc-800"
              : "absolute -right-[15px] w-[3px] rounded-r-[2px] bg-zinc-700 dark:bg-zinc-800"
          }
          style={{ top, height }}
        />
      ))}
    </>
  );
}

export function PhoneStatusBar() {
  return (
    <div
      aria-hidden
      className="relative z-30 flex h-[52px] w-full shrink-0 items-center justify-between px-8 pt-1 text-foreground pointer-events-none select-none"
    >
      <span className="w-[54px] text-center text-[15px] font-semibold tracking-tight">
        9:41
      </span>
      <div className="absolute left-1/2 top-[11px] h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8 .7 10.2 10.2 0 0 0 .8 3.6L2 4.8a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8 5.8c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8 9.2c.5 0 .9.2 1.2.5L8 11 6.8 9.7c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="12"
            rx="3.8"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path
            d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

export function PhoneHomeIndicator() {
  return (
    <div
      aria-hidden
      className="relative z-30 flex h-[22px] w-full shrink-0 items-start justify-center pointer-events-none"
    >
      <div className="h-[5px] w-[134px] rounded-full bg-foreground/80" />
    </div>
  );
}
