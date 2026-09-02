import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import {
  getAllStates,
  getDistrictsByState,
  isValidState,
  INDIAN_STATES_AND_DISTRICTS,
} from '@/lib/location-data';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * GET /api/v1/locations
 * Query parameters:
 *  - type=states (default) -> returns list of all states & codes
 *  - type=districts&state=West Bengal (or state=WB) -> returns array of districts for that state
 *  - type=all -> returns full tree of states and districts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'states';
    const state = searchParams.get('state') || searchParams.get('stateCode');

    if (type === 'districts') {
      if (!state) {
        return apiError(
          'Query parameter "state" or "stateCode" is required when requesting districts.',
          'MISSING_STATE_PARAMETER',
          422
        );
      }

      if (!isValidState(state)) {
        return apiError(
          `State "${state}" is not recognized in the official healthcare territory registry.`,
          'INVALID_STATE',
          404
        );
      }

      const districts = getDistrictsByState(state);
      return apiSuccess({
        state,
        totalDistricts: districts.length,
        districts,
      });
    }

    if (type === 'all') {
      return apiSuccess({
        totalStates: INDIAN_STATES_AND_DISTRICTS.length,
        states: INDIAN_STATES_AND_DISTRICTS,
      });
    }

    // Default: return list of states
    const states = getAllStates();
    return apiSuccess({
      totalStates: states.length,
      states,
    });
  } catch (err: any) {
    return apiError(
      'Internal server error while resolving geographical territory references.',
      'LOCATION_SERVICE_ERROR',
      500,
      err?.message
    );
  }
}
