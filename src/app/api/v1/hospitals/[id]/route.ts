import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const branchId = parseInt(id, 10);
    const branch = !isNaN(branchId)
      ? backendStore.getBranchById(branchId)
      : backendStore.getBranchByCode(id);

    if (!branch) {
      return apiError(`Hospital / Branch [${id}] not found.`, 404);
    }

    const doctors = backendStore.getDoctorsByBranch(branch.id);

    return apiSuccess({
      hospital: {
        id: branch.id,
        code: branch.code,
        name: branch.name,
        location: branch.location,
        address: branch.address || 'Newtown, Noapara, Sukanta Polli Road, Kolkata 700157, West Bengal, India',
        branchHead: branch.branchHead || 'Dr . Jiarul Haque (Owner & Medical Director)',
        adminName: branch.adminName,
        adminEmail: branch.adminEmail,
        adminPhone: branch.adminPhone || '9144376971',
        receptionCall: '+919144376971',
        receptionWhatsapp: '7810900370',
        status: branch.status,
        badgeStatus: branch.badgeStatus || 'ACTIVE',
        facilityType: branch.facilityType || 'Hospital',
        govRegNumber: branch.govRegNumber || 'WB.33735581',
        bedOccupancy: branch.bedOccupancy,
        totalDoctorsCount: doctors.length,
        doctors: doctors.map(d => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          department: d.department,
          qualification: d.qualification,
          fee: d.fee,
          status: d.status,
          contact: d.phone,
          email: d.email,
        })),
      }
    }, {
      message: `Hospital ${branch.name} details retrieved successfully.`
    });
  } catch (err: any) {
    return apiError(err?.message || 'Failed to fetch hospital details.', 500);
  }
}
