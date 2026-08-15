import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      organizationName,
      adminKey,
    } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        {
          message: "All required fields must be provided",
        },
        { status: 400 }
      );
    }

    // Validate ADMIN role key if provided (accept ADMIN123 or process.env.ADMIN_SECRET_KEY)
    const expectedKey = process.env.ADMIN_SECRET_KEY || "ADMIN123";
    if (role === "ADMIN" && adminKey && adminKey !== expectedKey) {
      return NextResponse.json(
        {
          message: "Invalid Admin Secret Key provided",
        },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email address already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role as any,
        organizationName:
          role === "NGO"
            ? organizationName || null
            : null,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        message: "Registration failed",
      },
      { status: 500 }
    );
  }
}