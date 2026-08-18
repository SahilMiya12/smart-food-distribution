import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: "Token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetTokenRecord) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    if (new Date() > resetTokenRecord.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ message: "Reset token has expired. Please request a new one." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: resetTokenRecord.email },
    });

    if (!user) {
      return NextResponse.json({ message: "Associated user not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: "Password reset successful! You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Server error resetting password" }, { status: 500 });
  }
}
