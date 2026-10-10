"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollTextProps {
  text: string;
  highlightWords?: readonly string[];
  color?: string;
  accentColor?: string;
  dimOpacity?: number;
  scrub?: number;
  stagger?: number;
  rise?: number;
  blur?: number;
  effect?: "fade" | "ascii" | "mosaic";
  start?: string;
  end?: string;
  align?: "left" | "center" | "right";
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
}

const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

const normalizeWord = (word: string) =>
  word.toLowerCase().replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");

const ASCII_GLYPHS = "!<>-_\\/[]{}=+*^?#$%&~:;0123456789";

export function ScrollText({
  text,
  highlightWords = [],
  color = "currentColor",
  accentColor = "#c9a76a",
  dimOpacity = 0.16,
  scrub = 0.6,
  stagger = 0.12,
  rise = 0,
  blur = 0,
  effect = "fade",
  start = "top 85%",
  end = "bottom 40%",
  align = "center",
  scroller,
  className,
  style,
}: ScrollTextProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const opacity = bounded(dimOpacity, 0.05, 1, 0.16);
  const smoothing = bounded(scrub, 0, 2, 0.6);
  const spacing = bounded(stagger, 0.01, 1, 0.12);
  const offset = bounded(rise, 0, 40, 0);
  const softness = bounded(blur, 0, 12, 0);
  const highlights = new Set(highlightWords.map(normalizeWord));

  useEffect(
    () => {
      const root = rootRef.current;
      if (!root || !text.trim()) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-scroll-word]", root);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const effects = effect === "fade" ? [] : words.map((word, index) => ({
          progress: 0,
          previous: -1,
          index,
          ink: gsap.utils.toArray<HTMLElement>("[data-scroll-ink]", word),
          glyphs: gsap.utils.toArray<HTMLElement>("[data-scroll-glyph]", word),
          tiles: gsap.utils.toArray<HTMLElement>("[data-scroll-tile]", word),
        }));
        const renderEffects = () => {
          effects.forEach((state) => {
            const progress = state.progress;
            if (state.previous === progress) return;
            state.previous = progress;

            if (effect === "ascii") {
              state.ink.forEach((letter, index) => {
                const reveal = gsap.utils.clamp(
                  0, 1, progress * (state.ink.length + 1) - index,
                );
                const glyph = state.glyphs[index];
                letter.style.opacity = String(reveal);
                glyph.style.opacity = String(1 - reveal);
                const symbolIndex = state.index * 7 + index * 11 + Math.floor(progress * 24);
                const symbol = ASCII_GLYPHS[symbolIndex % ASCII_GLYPHS.length];
                if (glyph.textContent !== symbol) glyph.textContent = symbol;
              });
            } else {
              state.ink[0].style.opacity = String(progress);
              state.tiles.forEach((tile, index) => {
                const order = ((index * 5 + state.index * 3) % 8) / 8;
                const dissolve = gsap.utils.clamp(
                  0, 1, progress * 1.6 - order * 0.6,
                );
                tile.style.opacity = String((1 - dissolve) * 0.7);
                tile.style.transform = `scale(${1 - dissolve * 0.75})`;
              });
            }
          });
        };

        renderEffects();
        gsap.set(words, {
          opacity,
          y: offset,
          ...(softness > 0 ? { filter: `blur(${softness}px)` } : {}),
        });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller: scroller?.current ?? undefined,
            start,
            end,
            scrub: smoothing || true,
            onRefresh: (self) => self.animation?.progress(self.progress),
          },
        });
        timeline.to(words, {
          opacity: 1,
          y: 0,
          ...(softness > 0 ? { filter: "blur(0px)" } : {}),
          duration: 1,
          stagger: spacing,
          ease: "none",
        });
        if (effects.length) {
          timeline.to(
            effects,
            {
              progress: 1,
              duration: 1,
              stagger: spacing,
              ease: "none",
              onUpdate: renderEffects,
            },
            0,
          );
        }
        const refresh = gsap
          .delayedCall(0.15, () => timeline.scrollTrigger?.refresh())
          .pause();
        const observer = new ResizeObserver(() => refresh.restart(true));
        observer.observe(root);
        if (scroller?.current) observer.observe(scroller.current);

        return () => {
          observer.disconnect();
          refresh.kill();
          effects.forEach(({ ink, glyphs, tiles }) => {
            ink.forEach((element) => element.style.removeProperty("opacity"));
            [...glyphs, ...tiles].forEach((element) => {
              element.style.opacity = "0";
              element.style.removeProperty("transform");
            });
          });
        };
      }, root);

      return () => media.revert();
    },
    [
      text,
      opacity,
      smoothing,
      spacing,
      offset,
      softness,
      effect,
      start,
      end,
      scroller,
    ],
  );

  return (
    <p
      ref={rootRef}
      className={cn(
        "m-0 whitespace-pre-wrap text-[clamp(24px,4vw,48px)] font-medium leading-[1.3] tracking-[-0.035em]",
        className,
      )}
      style={{ color, textAlign: align, ...style }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((part, index) =>
          /^\s*$/.test(part) ? part : (
            <span
              key={`${effect}-${index}`}
              data-scroll-word
              className="relative inline-block max-w-full align-baseline [overflow-wrap:anywhere]"
              style={
                highlights.has(normalizeWord(part))
                  ? { color: accentColor }
                  : undefined
              }
            >
              {effect === "ascii" ? (
                Array.from(part).map((letter, letterIndex) => (
                  <span key={letterIndex} className="relative inline-block">
                    <span data-scroll-ink>{letter}</span>
                    <span
                      data-scroll-glyph
                      className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono"
                      style={{ opacity: 0 }}
                    >
                      {ASCII_GLYPHS[letterIndex % ASCII_GLYPHS.length]}
                    </span>
                  </span>
                ))
              ) : effect === "mosaic" ? (
                <>
                  <span data-scroll-ink>{part}</span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-[18%] top-[18%] grid grid-cols-4 grid-rows-2 gap-px">
                    {Array.from({ length: 8 }, (_, tileIndex) => (
                      <span
                        key={tileIndex}
                        data-scroll-tile
                        className="bg-current"
                        style={{ opacity: 0 }}
                      />
                    ))}
                  </span>
                </>
              ) : part}
            </span>
          ),
        )}
      </span>
    </p>
  );
}

export default ScrollText;
