import { NextRequest, NextResponse } from "next/server";
import { fetchComponents, getCategoriesList } from "@/lib/registry";
import { ApiResponse, ComponentsListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const components = fetchComponents({ category, query, tag });
    const categories = getCategoriesList();

    const responseData: ComponentsListResponse = {
      components,
      total: components.length,
      categories,
    };

    const response: ApiResponse<ComponentsListResponse> = {
      success: true,
      data: responseData,
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
