import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

const repoPath = new URL(SITE_CONFIG.links.github).pathname.replace(/^\//, "");

export async function GET() {
  const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate },
  }).catch(() => null);

  const data = response?.ok ? await response.json() : null;
  const stars =
    typeof data?.stargazers_count === "number" ? data.stargazers_count : null;

  return NextResponse.json({ stars });
}
