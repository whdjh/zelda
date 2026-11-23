import type { ApiErrorCode, ApiResponse } from "./types";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number) {
    super(code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

interface RequestOptions<TBody> {
  method?: "GET" | "POST";
  body?: TBody;
  signal?: AbortSignal;
}

export async function apiRequest<TResponse, TBody = undefined>(
  url: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError("network_error", 0);
  }

  let payload: ApiResponse<TResponse>;
  try {
    payload = (await response.json()) as ApiResponse<TResponse>;
  } catch {
    throw new ApiError("network_error", response.status);
  }

  if (!response.ok || !payload.ok) {
    throw new ApiError(payload.ok ? "network_error" : payload.code, response.status);
  }

  return payload.data;
}
