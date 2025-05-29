import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getRTOInventories } from "@/app/models/dropshipper/rtoInventory"; // <-- make sure this function exists

export async function GET(req: NextRequest) {
  try {
    const dropshipperId = Number(req.headers.get('x-dropshipper-id'));
    const dropshipperRole = req.headers.get('x-dropshipper-role');

    logMessage('info', 'Received dropshipper info for RTO fetch', { dropshipperId, dropshipperRole });

    // Validate dropshipper ID
    if (!dropshipperId || isNaN(dropshipperId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing dropshipper ID.' },
        { status: 400 }
      );
    }

    // Validate dropshipper existence
    const userCheck = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userCheck.status) {
      return NextResponse.json(
        { status: false, error: `Unauthorized: ${userCheck.message}` },
        { status: 401 }
      );
    }

    // Fetch RTO Inventory
    const inventoryResult = await getRTOInventories(dropshipperId);

    if (inventoryResult?.status && inventoryResult.inventories?.length > 0) {
      return NextResponse.json(
        { status: true, inventories: inventoryResult.inventories },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: false, error: 'No RTO inventory found.' },
      { status: 404 }
    );

  } catch (error) {
    logMessage('error', 'Failed to fetch RTO inventory', { error });
    return NextResponse.json(
      { status: false, error: 'Internal server error while fetching RTO inventory.' },
      { status: 500 }
    );
  }
}
