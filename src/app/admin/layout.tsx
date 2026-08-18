import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Building,
  Bike,
  Package,
  Truck,
  BarChart3,
  FileText,
  Settings,
  CreditCard,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { verifyToken } from "@/lib/auth";

export default async function AdminLayout({
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

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users size={19} />,
    },
    {
      label: "Donors",
      href: "/admin/donors",
      icon: <HeartHandshake size={19} />,
    },
    {
      label: "NGOs",
      href: "/admin/ngos",
      icon: <Building size={19} />,
    },
    {
      label: "Volunteers",
      href: "/admin/volunteers",
      icon: <Bike size={19} />,
    },
    {
      label: "Donations",
      href: "/admin/donations",
      icon: <Package size={19} />,
    },
    {
      label: "Deliveries",
      href: "/admin/deliveries",
      icon: <Truck size={19} />,
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: <CreditCard size={19} />,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 size={19} />,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: <FileText size={19} />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings size={19} />,
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
