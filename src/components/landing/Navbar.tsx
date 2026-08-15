"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo with Animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Heart className="fill-emerald-700 text-emerald-700" size={28} />
            </motion.div>
            <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              FoodBridge
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Link
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-emerald-700"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="rounded-xl border-2 border-emerald-700 px-5 py-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:shadow-md"
            >
              Login
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col space-y-2 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border-2 border-emerald-700 px-5 py-3 text-center font-semibold text-emerald-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-center font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}