export interface GongApiErrorBody {
  errors?: string[];
  requestId?: string;
  [key: string]: unknown;
}

export class GongApiError extends Error {
  public readonly status: number;
  public readonly path: string;
  public readonly method: string;
  public readonly body: GongApiErrorBody | string | undefined;
  public readonly retryAfterSeconds: number | undefined;

  constructor(args: {
    status: number;
    method: string;
    path: string;
    body: GongApiErrorBody | string | undefined;
    retryAfterSeconds?: number;
  }) {
    const summary =
      typeof args.body === "object" && args.body && Array.isArray(args.body.errors)
        ? args.body.errors.join("; ")
        : typeof args.body === "string"
          ? args.body.slice(0, 500)
          : `HTTP ${args.status}`;
    super(`Gong ${args.method} ${args.path} → ${args.status}: ${summary}`);
    this.name = "GongApiError";
    this.status = args.status;
    this.method = args.method;
    this.path = args.path;
    this.body = args.body;
    this.retryAfterSeconds = args.retryAfterSeconds;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      status: this.status,
      method: this.method,
      path: this.path,
      body: this.body,
      retryAfterSeconds: this.retryAfterSeconds,
      message: this.message,
    };
  }
}

export function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}
