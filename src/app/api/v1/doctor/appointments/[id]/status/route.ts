import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';

export async function OPTIONS() {
  return handleOptions();
}

const ALLOWED_STATUSES = [
  'Scheduled',
  'Waiting',
  'In Consultation',
  'Completed',
  'Cancelled',
  'No-show',
] as const;

type AppointmentStatus = (typeof ALLOWED_STATUSES)[number];

function normalizeStatus(input: string): AppointmentStatus | null {
  const match = ALLOWED_STATUSES.find(
    (s) => s.toLowerCase() === input.trim().toLowerCase()
  );
  return match || null;
}

async function handleUpdateStatus(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    const params = await Promise.resolve(context.params);
    const idNum = parseInt(params.id, 10);

    if (isNaN(idNum)) {
      return apiError(`Invalid appointment id: ${params.id}`, 400);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const { status, notes } = body || {};

    if (!status || typeof status !== 'string') {
      return apiError('Missing required field: status', 422, {
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const normalized = normalizeStatus(status);
    if (!normalized) {
      return apiError(
        `Invalid status '${status}'. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
        422,
        { allowedStatuses: ALLOWED_STATUSES }
      );
    }

    const updated = backendStore.updateAppointmentStatus(idNum, normalized, notes);

    if (!updated) {
      return apiError(`Appointment with ID ${idNum} not found`, 404);
    }

    return apiSuccess(updated, {
      status: 200,
      message: `Appointment #${idNum} status successfully updated to '${normalized}'`,
    });
  } catch (err: any) {
    console.error('Error updating appointment status:', err);
    return apiError(err?.message || 'Failed to update appointment status', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdateStatus(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdateStatus(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdateStatus(request, context);
}
