"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface ImageLoaderImage {
  src: string;
  alt?: string;
  objectPosition?: string;
}

export type ImageLoaderEase = "power3.inOut" | "expo.inOut" | "sine.inOut";

export interface ImageLoaderProps {
  images: ImageLoaderImage[];
  finalImage: ImageLoaderImage;
  imageDuration?: number;
  transitionDuration?: number;
  holdDuration?: number;
  revealDuration?: number;
  initialDelay?: number;
  thumbnailWidth?: number;
  thumbnailAspectRatio?: number;
  borderRadius?: number;
  entranceScale?: number;
  ease?: ImageLoaderEase;
  background?: string;
  paused?: boolean;
  replayKey?: string | number;
  label?: string;
  children?: ReactNode;
  className?: string;
  onComplete?: () => void;
  onImageError?: (src: string) => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function ImageLoader({
  images,
  finalImage,
  imageDuration = 0.22,
  transitionDuration = 0.12,
  holdDuration = 1,
  revealDuration = 0.9,
  initialDelay = 0.15,
  thumbnailWidth = 240,
  thumbnailAspectRatio = 1.6,
  borderRadius = 6,
  entranceScale = 0.85,
  ease = "power3.inOut",
  background = "#191919",
  paused = false,
  replayKey = 0,
  label = "Loading images",
  children,
  className,
  onComplete,
  onImageError,
}: ImageLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const callbacksRef = useRef({ onComplete, onImageError });
  const pausedRef = useRef(paused);
  const finishedRef = useRef(false);
  const [complete, setComplete] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const sourceKey = JSON.stringify(images.map((image) => image.src));
  const width = bounded(thumbnailWidth, 240, 64, 600);
  const ratio = bounded(thumbnailAspectRatio, 1.6, 0.5, 3);
  const radius = bounded(borderRadius, 6, 0, 40);
  const scale = bounded(entranceScale, 0.85, 0.5, 1);
  const dwell = bounded(imageDuration, 0.22, 0.05, 3);
  const transition = bounded(transitionDuration, 0.12, 0.03, 1);
  const hold = bounded(holdDuration, 1, 0, 5);
  const reveal = bounded(revealDuration, 0.9, 0.2, 3);
  const delay = bounded(initialDelay, 0.15, 0, 3);

  useEffect(() => {
    callbacksRef.current = { onComplete, onImageError };
    pausedRef.current = paused;
    timelineRef.current?.paused(paused);
  }, [onComplete, onImageError, paused]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      finishedRef.current = false;
      setComplete(false);

      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const root = rootRef.current;
          const frame = frameRef.current;
          const content = contentRef.current;
          if (!root || !frame || !content) return;

          let active = true;
          const unsubscribe: (() => void)[] = [];
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-image-loader-card]",
            root,
          );
          const assets = gsap.utils.toArray<HTMLImageElement>(
            "[data-image-loader-asset]",
            root,
          );
          const finalAsset = frame.querySelector("img");
          const reduced = Boolean(context.conditions?.reduced);
          const thumbnailSize = () =>
            Math.min(width, root.clientWidth * 0.7, root.clientHeight * ratio * 0.7);

          const finish = () => {
            if (!active || finishedRef.current) return;
            finishedRef.current = true;
            setComplete(true);
            callbacksRef.current.onComplete?.();
          };

          gsap.set(cards, { autoAlpha: 0, scale: 1 });
          const sizeCards = context.add("sizeCards", () => {
            gsap.set(cards, {
              width: thumbnailSize,
              height: () => thumbnailSize() / ratio,
            });
          }) as () => void;
          sizeCards();
          gsap.set(frame, {
            autoAlpha: finishedRef.current ? 1 : 0,
            xPercent: -50,
            yPercent: -50,
            ...(finishedRef.current && {
              width: "100%",
              height: "100%",
              borderRadius: 0,
            }),
          });
          gsap.set(content, { autoAlpha: finishedRef.current ? 1 : 0, y: 0 });

          const start = context.add("start", () => {
            if (!active) return;
            const available = cards.filter(
              (card) => (card.querySelector("img")?.naturalWidth ?? 0) > 0,
            );
            setImageFailed(!finalAsset?.naturalWidth);
            assets
              .filter((image) => !image.naturalWidth)
              .forEach((image) => callbacksRef.current.onImageError?.(image.src));

            if (reduced || finishedRef.current) {
              gsap.set(frame, {
                autoAlpha: 1,
                width: "100%",
                height: "100%",
                borderRadius: 0,
              });
              gsap.set(content, { autoAlpha: 1, y: 0 });
              finish();
              return;
            }

            const timeline = gsap.timeline({
              paused: pausedRef.current,
              defaults: { ease: "power2.out" },
              onComplete: finish,
            });
            timelineRef.current = timeline;
            const first = available[0];
            if (first) {
              timeline.fromTo(
                first,
                { autoAlpha: 0, scale },
                { autoAlpha: 1, scale: 1, duration: transition * 1.5 },
                delay,
              );
              available.forEach((card, index) => {
                if (index === 0) return;
                timeline
                  .to(card, { autoAlpha: 1, duration: transition }, `>+=${dwell}`)
                  .to(
                    available[index - 1],
                    { autoAlpha: 0, duration: transition },
                    "<",
                  );
              });
            }

            timeline
              .set(
                frame,
                {
                  width: thumbnailSize,
                  height: () => thumbnailSize() / ratio,
                  borderRadius: radius,
                },
                `>+=${first ? hold : delay}`,
              )
              .to(frame, { autoAlpha: 1, duration: transition })
              .to(cards, { autoAlpha: 0, duration: transition }, "<")
              .addLabel("expand")
              .fromTo(
                frame,
                {
                  width: thumbnailSize,
                  height: () => thumbnailSize() / ratio,
                  borderRadius: radius,
                },
                {
                  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                  duration: reveal,
                  ease,
                  immediateRender: false,
                },
                "expand",
              )
              .fromTo(
                content,
                { autoAlpha: 0, y: 12 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.4,
                  immediateRender: false,
                },
                `expand+=${reveal * 0.75}`,
              );
          }) as () => void;

          const ready = assets.map((image) => {
            if (image.complete) return Promise.resolve();
            return new Promise<void>((resolve) => {
              const settle = () => {
                image.removeEventListener("load", settle);
                image.removeEventListener("error", settle);
                resolve();
              };
              image.addEventListener("load", settle, { once: true });
              image.addEventListener("error", settle, { once: true });
              unsubscribe.push(settle);
            });
          });

          void Promise.all(ready)
            .then(() =>
              Promise.allSettled(
                assets
                  .filter((image) => image.naturalWidth > 0)
                  .map((image) => image.decode()),
              ),
            )
            .then(start);
          let previousWidth = root.clientWidth;
          let previousHeight = root.clientHeight;
          const resize = new ResizeObserver(() => {
            const nextWidth = root.clientWidth;
            const nextHeight = root.clientHeight;
            if (nextWidth === previousWidth && nextHeight === previousHeight) return;
            previousWidth = nextWidth;
            previousHeight = nextHeight;
            sizeCards();
            const timeline = timelineRef.current;
            if (!timeline || finishedRef.current) return;
            const time = timeline.time();
            timeline.invalidate().time(time, true);
          });
          resize.observe(root);

          return () => {
            active = false;
            unsubscribe.forEach((remove) => remove());
            resize.disconnect();
            timelineRef.current = null;
          };
        },
        rootRef,
      );

      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        sourceKey,
        finalImage.src,
        width,
        ratio,
        radius,
        scale,
        dwell,
        transition,
        hold,
        reveal,
        delay,
        ease,
        replayKey,
      ],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      aria-busy={!complete}
      data-slot="image-loader"
      className={cn("relative isolate min-h-80 w-full overflow-hidden", className)}
      style={{ backgroundColor: background }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            data-image-loader-card
            className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0"
            style={{
              width: `min(${width}px, 70%)`,
              aspectRatio: ratio,
              borderRadius: radius,
            }}
          >
            <img
              data-image-loader-asset
              src={image.src}
              alt=""
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: image.objectPosition ?? "center" }}
            />
          </div>
        ))}
      </div>
      <div
        ref={frameRef}
        aria-hidden={!complete}
        className="invisible absolute top-1/2 left-1/2 z-10 overflow-hidden opacity-0"
        style={{
          width: `min(${width}px, 70%)`,
          aspectRatio: ratio,
          borderRadius: radius,
        }}
      >
        <img
          data-image-loader-asset
          src={finalImage.src}
          alt={finalImage.alt ?? "Revealed image"}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: finalImage.objectPosition ?? "center" }}
        />
        {imageFailed && (
          <div
            role="alert"
            className="absolute inset-0 flex items-center justify-center bg-[#191919] p-6 text-center text-sm text-white/70"
          >
            This image could not be loaded.
          </div>
        )}
      </div>
      <div
        ref={contentRef}
        inert={!complete}
        aria-hidden={!complete}
        className="invisible absolute inset-0 z-20 opacity-0"
      >
        {children}
      </div>
      <span role="status" className="sr-only">
        {complete ? "Images ready" : label}
      </span>
    </div>
  );
}

export default ImageLoader;
