import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Retrieve x-admin-id from request headers
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is missing from request" },
        { status: 400 }
      );
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: admins }, { status: 200 });
  } catch (error) {
    console.error(`error - `, error);
    return NextResponse.json({ success: false, error: "Failed to fetch admins" }, { status: 500 });
  }
}
