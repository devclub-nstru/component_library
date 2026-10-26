const BLUR_LAYERS = [1, 2, 4, 8, 16, 24];

export function WebsiteBottomBlur() {
  return (
    <div
      data-website-bottom-blur
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[clamp(72px,12dvh,144px)] select-none"
    >
      {BLUR_LAYERS.map((blur, index) => {
        const start = (index / BLUR_LAYERS.length) * 100;
        const end = ((index + 1) / BLUR_LAYERS.length) * 100;
        const mask = `linear-gradient(to bottom, transparent ${start}%, black ${end}%)`;

        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
