import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const alt = `${SITE_CONFIG.name}: ${SITE_CONFIG.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const gambetta = await readFile(
    join(process.cwd(), "public/fonts/Gambetta-Regular.otf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          background: "#050505",
          color: "#f4f4f5",
          borderTop: "12px solid #18181b",
          borderBottom: "12px solid #18181b",
        }}
      >
        <div style={{ fontFamily: "Gambetta", fontSize: 96, lineHeight: 1 }}>
          {SITE_CONFIG.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            lineHeight: 1.3,
            color: "#a1a1aa",
            maxWidth: 900,
          }}
        >
          {SITE_CONFIG.description}
        </div>
        <div style={{ marginTop: 40, fontSize: 28, color: "#71717a" }}>
          {SITE_CONFIG.url.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Gambetta", data: gambetta, style: "normal", weight: 400 }],
    },
  );
}
