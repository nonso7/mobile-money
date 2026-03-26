import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  Summary,
  collectDefaultMetrics,
} from "prom-client";

const register = new Registry();

// Add default metrics (CPU, Memory, etc.)
collectDefaultMetrics({ register });

// HTTP Metrics
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // standard buckets
  registers: [register],
});

// Business Logic Metrics
export const transactionTotal = new Counter({
  name: "transaction_total",
  help: "Total number of transactions processed",
  labelNames: ["type", "provider", "status"], // type: payment/payout
  registers: [register],
});

export const transactionErrorsTotal = new Counter({
  name: "transaction_errors_total",
  help: "Total number of transaction errors",
  labelNames: ["type", "provider", "error_type"],
  registers: [register],
});

// Mobile Money Provider Metrics
export const providerResponseTimeSeconds = new Histogram({
  name: "provider_response_time_seconds",
  help: "Response time of mobile money provider API calls in seconds",
  labelNames: ["provider", "operation", "status"],
  buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 20, 30, 60],
  registers: [register],
});

export const providerResponseTimeSummary = new Summary({
  name: "provider_response_time_summary",
  help: "Precise quantiles for mobile money provider response times",
  labelNames: ["provider", "operation", "status"],
  percentiles: [0.5, 0.9, 0.95, 0.99],
  registers: [register],
});

export const healthCheckResponseTimeSeconds = new Histogram({
  name: "health_check_response_time_seconds",
  help: "Response time for mobile money health pings",
  labelNames: ["provider", "status"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

export const slowRequestsTotal = new Counter({
  name: "slow_requests_total",
  help: "Total number of mobile money provider requests taking > 5 seconds",
  labelNames: ["provider", "operation"],
  registers: [register],
});

export const timeoutRequestsTotal = new Counter({
  name: "timeout_requests_total",
  help: "Total number of mobile money provider requests that timed out",
  labelNames: ["provider", "operation"],
  registers: [register],
});

// Connection Metrics
export const activeConnections = new Gauge({
  name: "active_connections",
  help: "Number of active HTTP connections",
  registers: [register],
});

export { register };
