import { calcGeneratorDuration, spring } from "motion";

export const promptComposerBounded = (
  value: number,
  fallback: number,
  min: number,
  max: number,
) => (Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback);

export function promptComposerSpring(
  stiffness: number,
  damping: number,
  speed: number,
  reduced: boolean | null,
) {
  const response = spring({
    keyframes: [0, 1],
    stiffness: promptComposerBounded(stiffness, 360, 120, 600),
    damping: promptComposerBounded(damping, 32, 18, 60),
    restSpeed: 0.001,
    restDelta: 0.001,
  });
  const settle = calcGeneratorDuration(response);
  return {
    duration: reduced
      ? 0
      : settle / 1000 / promptComposerBounded(speed, 1, 0.5, 2),
    ease: (progress: number) =>
      progress === 1 ? 1 : response.next(progress * settle).value,
  };
}
