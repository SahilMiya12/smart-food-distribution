import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Security standard: Don't reveal user existence
      return NextResponse.json({
        message: "If an account with that email exists, password reset instructions have been generated.",
      });
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: user.email },
    });

    // Generate secure token & 1 hour expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    // Generate reset URL
    const resetUrl = `/reset-password?token=${token}`;

    return NextResponse.json({
      message: "Password reset link generated successfully.",
      resetUrl,
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error generating reset token" }, { status: 500 });
  }
}
