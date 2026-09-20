import { NextRequest, NextResponse } from "next/server";
import { fetchComponentBySlug } from "@/lib/registry";
import { ApiResponse } from "@/types/api";
import { ComponentRegistryItem } from "@/types/component";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const component = fetchComponentBySlug(slug);

    if (!component) {
      const notFoundResponse: ApiResponse<never> = {
        success: false,
        error: `Component '${slug}' not found`,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    const response: ApiResponse<ComponentRegistryItem> = {
      success: true,
      data: component,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
