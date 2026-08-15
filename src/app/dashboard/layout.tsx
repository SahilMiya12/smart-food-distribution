import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "auth_token"
  )?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}