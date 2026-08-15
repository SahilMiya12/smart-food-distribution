"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-emerald-800 transition hover:text-emerald-900"
          >
            <Heart className="fill-emerald-700 text-emerald-700" size={28} />
            <span>FoodBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition ${
                  isActive(link.href)
                    ? "text-emerald-700"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-emerald-700" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl border-2 border-emerald-700 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border-2 border-emerald-700 px-5 py-2.5 text-center font-semibold text-emerald-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-center font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}