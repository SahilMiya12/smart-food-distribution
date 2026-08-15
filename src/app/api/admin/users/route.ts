import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const whereClause = role ? { role: role as any } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
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
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN GET USERS ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role, phone, city, organizationName } = body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        phone,
        city,
        organizationName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("ADMIN CREATE USER ERROR:", error);
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("ADMIN DELETE USER ERROR:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
