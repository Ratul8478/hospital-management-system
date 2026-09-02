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
  error: string | Error,
  statusOrCode: number | string = 400,
  detailsOrStatus?: any,
  extraDetails?: any
) {
  let status = 400;
  let code: string | undefined;
  let details: any = undefined;

  if (typeof statusOrCode === 'number') {
    status = statusOrCode;
    details = detailsOrStatus;
  } else if (typeof statusOrCode === 'string') {
    code = statusOrCode;
    if (typeof detailsOrStatus === 'number') {
      status = detailsOrStatus;
      details = extraDetails;
    } else {
      details = detailsOrStatus;
    }
  }

  const message = typeof error === 'string' ? error : (error as any)?.message || 'Request failed';

  const body: {
    success: false;
    error: {
      message: string;
      code?: string;
      details?: unknown;
    };
    code?: string;
    details?: unknown;
  } = {
    success: false,
    error: {
      message,
      ...(code ? { code } : {}),
      ...(details !== undefined ? { details } : {}),
    },
    ...(code ? { code } : {}),
    ...(details !== undefined ? { details } : {}),
  };

  return NextResponse.json(body, {
    status: typeof status === 'number' && status >= 200 && status <= 599 ? status : 400,
    headers: CORS_HEADERS,
  });
}

/**
 * Safe 500 handler: logs the real error server-side (with stack) but returns
 * a generic message so stack traces, driver errors, and internal details
 * never reach the client.
 */
export function apiServerError(errOrRoute?: unknown, err?: unknown) {
  const errorObj = err || errOrRoute;
  const route = typeof errOrRoute === 'string' ? errOrRoute : 'API';
  console.error(`[API ERROR] ${route}:`, errorObj);
  return apiError('Internal server error. Please try again later.', 500);
}
