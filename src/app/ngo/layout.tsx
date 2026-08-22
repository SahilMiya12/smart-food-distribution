import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileText,
  PackageCheck,
  Bell,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { verifyToken } from "@/lib/auth";

export default async function NgoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "NGO") {
    redirect("/");
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/ngo/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: "Browse Food",
      href: "/ngo/browse",
      icon: <Search size={19} />,
    },
    {
      label: "My Requests",
      href: "/ngo/requests",
      icon: <FileText size={19} />,
    },
    {
      label: "Rescued Food",
      href: "/ngo/my-food",
      icon: <PackageCheck size={19} />,
    },
    {
      label: "Notifications",
      href: "/ngo/notifications",
      icon: <Bell size={19} />,
    },
  ];

  return (
    <DashboardShell
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN",
      }}
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  );
}