import { ComponentRegistryItem } from "./component";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ComponentsListResponse {
  components: ComponentRegistryItem[];
  total: number;
  categories: string[];
}

export interface HealthCheckResponse {
  status: "ok" | "degraded" | "error";
  version: string;
  uptime: number;
  timestamp: string;
  environment: string;
}
