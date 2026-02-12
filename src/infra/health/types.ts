export type HealthStatus = "ok" | "warn" | "fail";

export interface HealthCheckResult {
  key: string;
  status: HealthStatus;
  summary: string;
  details?: Record<string, any>;
  recommendation?: string;
  repair_executed?: boolean;
  repair_log?: string;
}

export interface GlobalHealthReport {
  ts: string;
  overall_status: HealthStatus;
  checks: HealthCheckResult[];
}
