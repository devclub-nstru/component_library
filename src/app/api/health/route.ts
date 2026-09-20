import { NextResponse } from "next/server";
import { HealthCheckResponse } from "@/types/api";

const startTime = Date.now();

export async function GET() {
  const healthData: HealthCheckResponse = {
    status: "ok",
    version: "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(
    {
      success: true,
      data: healthData,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
