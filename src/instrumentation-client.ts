import posthog from "posthog-js";
import { POSTHOG_APP, POSTHOG_KEY } from "@/lib/analytics";

const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(
  window.location.hostname,
);
const devKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const key =
  devKey ||
  (process.env.NODE_ENV === "production" && !isLocalHost ? POSTHOG_KEY : "");

if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
    enable_heatmaps: true,
    capture_dead_clicks: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    session_recording: { maskAllInputs: true },
  });
  posthog.register({ app: POSTHOG_APP });
}
