"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";

type UserRole =
  | "DONOR"
  | "NGO"
  | "VOLUNTEER"
  | "ADMIN";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type DashboardShellProps = {
  children: React.ReactNode;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
  navItems: NavItem[];
};

function getRoleDashboard(role: UserRole) {
  switch (role) {
    case "DONOR":
      return "/donor/dashboard";

    case "NGO":
      return "/ngo/dashboard";

    case "VOLUNTEER":
      return "/volunteer/dashboard";

    case "ADMIN":
      return "/admin/dashboard";

    default:
      return "/login";
  }
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "DONOR":
      return "Donor";

    case "NGO":
      return "NGO";

    case "VOLUNTEER":
      return "Volunteer";

    case "ADMIN":
      return "Administrator";

    default:
      return "User";
  }
}

export default function DashboardShell({
  children,
  user,
  navItems,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      setLoggingOut(false);
    }
  }

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const roleLabel = getRoleLabel(user.role);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">

          <Link
            href={getRoleDashboard(user.role)}
            onClick={() =>
              setMobileOpen(false)
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl shadow-sm">
              🌱
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                FoodBridge
              </p>

              <p className="text-[11px] text-slate-500">
                Smart Food Distribution
              </p>
            </div>

          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* User Summary */}
        <div className="border-b border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">
              {initials}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-900">
                {user.firstName}{" "}
                {user.lastName}
              </p>

              <p className="truncate text-xs text-slate-500">
                {roleLabel}
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          {navItems.map((item) => {

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`
                  group flex items-center gap-3
                  rounded-xl px-3 py-3
                  text-sm font-semibold
                  transition
                  ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >

                <span
                  className={`
                    transition
                    ${
                      active
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  `}
                >
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </Link>
            );

          })}

          <div className="my-5 border-t border-slate-100" />

          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Account
          </p>

          <Link
            href="/notifications"
            onClick={() =>
              setMobileOpen(false)
            }
            className={`
              flex items-center gap-3
              rounded-xl px-3 py-3
              text-sm font-semibold
              transition
              ${
                pathname.startsWith(
                  "/notifications"
                )
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <Bell size={19} />
            Notifications
          </Link>

          <Link
            href="/profile"
            onClick={() =>
              setMobileOpen(false)
            }
            className={`
              flex items-center gap-3
              rounded-xl px-3 py-3
              text-sm font-semibold
              transition
              ${
                pathname.startsWith(
                  "/profile"
                )
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <User size={19} />
            Profile
          </Link>

          <Link
            href="/settings"
            onClick={() =>
              setMobileOpen(false)
            }
            className={`
              flex items-center gap-3
              rounded-xl px-3 py-3
              text-sm font-semibold
              transition
              ${
                pathname.startsWith(
                  "/settings"
                )
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <Settings size={19} />
            Settings
          </Link>

        </nav>

        {/* Logout */}
        <div className="border-t border-slate-100 p-4">

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <LogOut size={19} />

            {loggingOut
              ? "Signing out..."
              : "Sign out"}

          </button>

        </div>

      </aside>

      {/* Main Area */}
      <div className="lg:pl-72">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl md:px-8">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Welcome */}
          <div className="hidden lg:block">

            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {roleLabel} Workspace
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Welcome back,{" "}
              {user.firstName} 👋
            </h2>

          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4">

            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative rounded-xl p-3 text-slate-600 transition hover:bg-slate-100"
              aria-label="Notifications"
            >

              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />

            </Link>

            {/* Profile Dropdown */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (current) =>
                      !current
                  )
                }
                className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">
                  {initials}
                </div>

                <div className="hidden text-left sm:block">

                  <p className="max-w-32 truncate text-sm font-bold text-slate-900">
                    {user.firstName}{" "}
                    {user.lastName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {roleLabel}
                  </p>

                </div>

                <ChevronDown
                  size={17}
                  className="hidden text-slate-400 sm:block"
                />

              </button>

              {profileOpen && (

                <>

                  {/* Dropdown Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-4">

                      <p className="font-bold text-slate-900">
                        {user.firstName}{" "}
                        {user.lastName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>

                    </div>

                    <div className="p-2">

                      <Link
                        href="/profile"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <User size={17} />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Settings size={17} />
                        Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />

                        {loggingOut
                          ? "Signing out..."
                          : "Sign out"}
                      </button>

                    </div>

                  </div>

                </>

              )}

            </div>

          </div>

        </header>

        {/* Page Content */}
       {/* Page Content */}
<main className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
  {children}
</main>
      </div>

    </div>
  );
}