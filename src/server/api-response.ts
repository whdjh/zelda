import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiResponse } from "@/api/types";

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ ok: true, data }, { status });
}

export function apiFail(code: ApiErrorCode, status = 400) {
  return NextResponse.json<ApiResponse<never>>({ ok: false, code }, { status });
}
