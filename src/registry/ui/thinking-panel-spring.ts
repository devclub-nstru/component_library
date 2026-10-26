import { calcGeneratorDuration, spring } from "motion";
import { thinkingPanelBounded } from "./thinking-panel-types";

export function thinkingPanelSpring(
  stiffness: number,
  damping: number,
  speed: number,
  reduced: boolean,
) {
  const response = spring({
    keyframes: [0, 1],
    stiffness: thinkingPanelBounded(stiffness, 380, 120, 600),
    damping: thinkingPanelBounded(damping, 34, 20, 60),
    restSpeed: 0.001,
    restDelta: 0.001,
  });
  const settle = calcGeneratorDuration(response);
  return {
    duration: reduced
      ? 0
      : settle / 1000 / thinkingPanelBounded(speed, 1, 0.5, 2),
    ease: (progress: number) =>
      progress === 1 ? 1 : response.next(progress * settle).value,
  };
}
