import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        organizationName: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, address, city, organizationName } = body;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        city: city !== undefined ? city : undefined,
        organizationName: organizationName !== undefined ? organizationName : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        organizationName: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
