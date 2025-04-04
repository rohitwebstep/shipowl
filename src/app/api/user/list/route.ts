import { NextRequest, NextResponse } from "next/server";
import { isUserExist } from "@/utils/authUtils";

export async function GET(req: NextRequest) {
  try {
    // Retrieve x-user-id from request headers
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if user exists
    const result = await isUserExist(Number(userId), String(userRole));
    console.log(`result - `, result);
    if (!result.status) {
      return NextResponse.json({ error: `User Not Found 1: ${result.message}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.user }, { status: 200 });
  } catch (error) {
    console.error(`error - `, error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
