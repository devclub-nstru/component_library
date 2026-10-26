export function createMosaicTile(
  size: number,
  kind: "cream" | "brand" | "blue" | "orange",
  isDark: boolean,
  shade = 0,
) {
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const context = sprite.getContext("2d");
  if (!context) return sprite;

  context.scale(size / 32, size / 32);
  context.lineWidth = 1;
  if (kind === "cream") {
    context.fillStyle = (isDark
      ? ["#e9e3d5", "#d9d3c5", "#c6c1b4"]
      : ["#dad9ca", "#cccbbd", "#bebdaf"])[shade];
    context.fillRect(0.5, 0.5, 31, 31);
  } else if (kind === "brand") {
    context.fillStyle = "#0080fc";
    context.fillRect(0, 0, 32, 32);
    context.strokeStyle = "#062a4f";
    context.lineWidth = 1.7;
    context.beginPath();
    context.moveTo(8, 23);
    context.lineTo(15, 13);
    context.lineTo(19, 18);
    context.lineTo(25, 7);
    context.stroke();
  } else {
    const blue = isDark ? "#4199b5" : "#157caa";
    const orange = isDark ? "#ee6b35" : "#df6a3b";
    context.strokeStyle = kind === "blue" ? blue : orange;
    context.lineWidth = kind === "blue" ? 3.5 : 2;
    if (kind === "orange") {
      context.fillStyle = orange;
      context.fillRect(0, 0, 32, 32);
      context.strokeStyle = "#282723";
    }
    context.strokeRect(3, 3, 26, 26);
  }
  return sprite;
}

