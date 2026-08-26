import { NextResponse } from 'next/server';

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Doctor-Id, X-Branch-Id, x-api-key, X-API-Key',
  'Access-Control-Max-Age': '86400',
};

export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export interface ApiResponseOptions {
  status?: number;
  message?: string;
  meta?: Record<string, unknown>;
}

export function apiSuccess<T>(data: T, options?: ApiResponseOptions | number) {
  const opts: ApiResponseOptions = typeof options === 'number' ? { status: options } : options || {};
  const status = opts.status ?? 200;
  
  const body: {
    success: true;
    message?: string;
    data: T;
    meta?: Record<string, unknown>;
  } = {
    success: true,
    data,
  };

  if (opts.message) {
    body.message = opts.message;
  }
  if (opts.meta) {
    body.meta = opts.meta;
  }

  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}

export function apiError(
  error: string,
  status: number = 400,
  details?: Record<string, unknown> | unknown[] | string
) {
  const body: {
    success: false;
    error: string;
    details?: unknown;
  } = {
    success: false,
    error,
  };

  if (details !== undefined) {
    body.details = details;
  }

  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}
