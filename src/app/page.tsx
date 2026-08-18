"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  HandHeart,
  Truck,
  Users,
  Star,
  Package,
  CheckCircle,
  Sparkles,
  Shield,
  Clock,
  Coffee,
  Apple,
  Wheat,
  Fish,
  Milk,
  Cake,
  Pizza,
  ChefHat,
  ChevronDown,
  ArrowUp,
  HelpCircle,
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const foodCategories = [
    { icon: Coffee, name: "Beverages", count: "124 donations", bg: "bg-amber-500", bgLight: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    { icon: Apple, name: "Fresh Fruits", count: "89 donations", bg: "bg-rose-500", bgLight: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    { icon: Wheat, name: "Grains", count: "56 donations", bg: "bg-yellow-500", bgLight: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
    { icon: Fish, name: "Seafood", count: "34 donations", bg: "bg-cyan-500", bgLight: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700" },
    { icon: Milk, name: "Dairy", count: "67 donations", bg: "bg-sky-500", bgLight: "bg-sky-50", border: "border-sky-200", text: "text-sky-700" },
    { icon: Cake, name: "Bakery", count: "78 donations", bg: "bg-pink-500", bgLight: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
    { icon: Pizza, name: "Prepared Meals", count: "92 donations", bg: "bg-orange-500", bgLight: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
    { icon: ChefHat, name: "Catering", count: "45 donations", bg: "bg-purple-500", bgLight: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  ];

  const testimonials = [
    {
      quote: "Smart Food Distribution has transformed how we serve our community. We've been able to provide 3x more meals with less waste.",
      author: "Sarah Johnson",
      role: "Executive Director, City Food Bank",
      rating: 5,
      image: "👩‍💼",
    },
    {
      quote: "As a small restaurant, we used to throw away so much food. Now we donate it and feel good knowing it helps people.",
      author: "Michael Chen",
      role: "Owner, Green Leaf Cafe",
      rating: 5,
      image: "👨‍🍳",
    },
    {
      quote: "Volunteering through this platform has been incredibly rewarding. I've delivered over 200 meals in my neighborhood.",
      author: "Priya Patel",
      role: "Volunteer Driver",
      rating: 5,
      image: "👩‍🌾",
    },
    {
      quote: "The platform is so easy to use. We've been able to coordinate food distribution seamlessly with our partner NGOs.",
      author: "David Kim",
      role: "Operations Manager, Food Rescue",
      rating: 5,
      image: "👨‍💼",
    },
  ];

  const features = [
    {
      icon: HandHeart,
      title: "For Donors",
      description: "Share surplus food easily. List donations, manage requests, and track your impact.",
      items: ["Easy donation listing", "Real-time request management", "Impact tracking"],
      color: "emerald",
    },
    {
      icon: Users,
      title: "For NGOs",
      description: "Find and request food donations. Coordinate deliveries and serve your community.",
      items: ["Browse available food", "Simple request process", "Delivery coordination"],
      color: "blue",
    },
    {
      icon: Truck,
      title: "For Volunteers",
      description: "Help deliver food to those who need it. Make a difference in your community.",
      items: ["Find deliveries near you", "Flexible scheduling", "Track your impact"],
      color: "purple",
    },
  ];

  const stats = [
    { icon: HandHeart, value: "15,420", label: "Meals Donated", trend: "+12% this month" },
    { icon: Users, value: "320+", label: "NGO Partners", trend: "+18 new this year" },
    { icon: Truck, value: "8,750", label: "Active Volunteers", trend: "+230 last week" },
    { icon: Heart, value: "12,850", label: "Lives Impacted", trend: "+1,200 this quarter" },
  ];

  const faqs = [
    {
      q: "Is Smart Food Distribution free to use?",
      a: "Yes! Smart Food Distribution is completely free for donors, NGOs, and volunteers.",
    },
    {
      q: "Who can donate food?",
      a: "Anyone with surplus food can donate — restaurants, grocery stores, catering services, bakeries, and individuals.",
    },
    {
      q: "What types of food can be donated?",
      a: "Prepared meals, fresh produce, packaged goods, bakery items, dairy products, and more. Ensure food is safe and within expiry.",
    },
    {
      q: "How do NGOs receive food?",
      a: "NGOs browse available donations, request food, and once approved by the donor, volunteer drivers deliver it.",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MainLayout>
      {/* Floating Action Button */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-300 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-28">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-2xl" />
        </motion.div>

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Sparkles size={16} className="text-emerald-600" />
                  </motion.span>
                  Together for a better tomorrow
                </div>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl font-extrabold tracking-tight leading-tight text-emerald-950 sm:text-5xl md:text-6xl lg:text-7xl">
                Share More.
                <br />
                Waste Less.
                <br />
                <span className="relative">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-2xl opacity-20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Feed Everyone.
                  </span>
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
                Connect surplus food with people who need it. Together, we can
                reduce food waste and build a better tomorrow for our communities.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40 sm:w-auto sm:px-7 sm:py-4"
                  >
                    Start Donating
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                  <Link
                    href="/how-it-works"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 px-6 py-3.5 font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 sm:w-auto sm:px-7 sm:py-4"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8 sm:gap-6">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D", "E"].map((letter, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.8 }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-200 to-emerald-300 text-xs font-bold text-emerald-700 shadow-md sm:h-10 sm:w-10 sm:text-sm"
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 1 }}
                      >
                        <Star size={16} fill="currentColor" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 sm:text-sm">Trusted by 500+ registered organizations</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Graphic Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-4 lg:mt-0"
            >
              <div className="relative flex h-[380px] items-center justify-center rounded-[32px] bg-gradient-to-br from-emerald-200 via-emerald-100 to-teal-100 sm:h-[450px] sm:rounded-[40px] lg:h-[520px]">
                <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] bg-gradient-to-tr from-emerald-500/10 to-teal-500/10" />

                {/* Floating metrics */}
                {[
                  { icon: Package, label: "Today's Donations", value: "124", color: "emerald", pos: "-left-2 -top-2 sm:-left-4 sm:-top-4 lg:-left-8 lg:-top-8" },
                  { icon: Users, label: "Active NGOs", value: "320+", color: "blue", pos: "-bottom-2 -right-2 sm:-bottom-4 sm:-right-4 lg:-bottom-8 lg:-right-8" },
                  { icon: Shield, label: "Safe Delivery", value: "99.9%", color: "purple", pos: "top-1/4 -right-2 lg:-right-4" },
                  { icon: Clock, label: "Avg Response", value: "< 2hrs", color: "amber", pos: "bottom-1/4 -left-2 lg:-left-4" },
                ].map((card, index) => {
                  const Icon = card.icon;
                  const colors = {
                    emerald: "bg-emerald-100 text-emerald-700",
                    blue: "bg-blue-100 text-blue-700",
                    purple: "bg-purple-100 text-purple-700",
                    amber: "bg-amber-100 text-amber-700",
                  };

                  return (
                    <motion.div
                      key={index}
                      className={`absolute ${card.pos} rounded-2xl bg-white p-3 shadow-lg backdrop-blur-sm sm:p-4`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.6 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`rounded-xl p-2 ${colors[card.color as keyof typeof colors]}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 sm:text-xs">{card.label}</p>
                          <p className="text-sm font-bold text-slate-900 sm:text-base">{card.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Center Banner */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl sm:h-32 sm:w-32"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <HandHeart size={54} className="text-emerald-700 sm:hidden" />
                    <HandHeart size={70} className="hidden text-emerald-700 sm:block" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-emerald-950 sm:text-2xl">Every Meal Matters</h3>
                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">Small actions. Big impact.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="relative bg-[#f8faf8] pb-12 sm:pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-3 rounded-3xl bg-white p-4 shadow-xl sm:gap-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-300 hover:bg-emerald-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-all duration-300 group-hover:scale-110">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-950 sm:text-2xl">{stat.value}</p>
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-0.5 text-[11px] text-emerald-600">{stat.trend}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FOOD CATEGORIES SECTION - PROPERLY RENDERED WITH CRISP BADGES */}
      <section className="py-16 bg-white sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Food Categories
            </span>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl lg:text-5xl">
              Popular Food Donations
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Browse available food categories and find what your community needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {foodCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className={`group relative overflow-hidden rounded-3xl border ${category.border} ${category.bgLight} p-6 shadow-sm transition-all duration-300 hover:shadow-lg`}
                >
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${category.bg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                  <p className={`mt-1 text-xs font-semibold ${category.text}`}>{category.count}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50/30 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Four simple steps to make a big impact in your community.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: HandHeart, title: "Donate Food", description: "Share surplus food from your home, restaurant, or business.", color: "emerald" },
              { icon: Users, title: "NGO Requests", description: "NGOs find and request the food they need.", color: "blue" },
              { icon: Truck, title: "Volunteer Delivers", description: "Volunteers pick up and deliver food to NGOs.", color: "purple" },
              { icon: Heart, title: "Community Impact", description: "Food reaches people who need it most.", color: "rose" },
            ].map((step, index) => {
              const Icon = step.icon;
              const colors = {
                emerald: "bg-emerald-100 text-emerald-700",
                blue: "bg-blue-100 text-blue-700",
                purple: "bg-purple-100 text-purple-700",
                rose: "bg-rose-100 text-rose-700",
              };

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 text-center transition hover:shadow-lg"
                >
                  <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${colors[step.color as keyof typeof colors]} transition-all duration-300`}>
                    <Icon size={28} />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-emerald-950">{step.title}</h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed sm:text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-white sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Why Smart Food Distribution
            </span>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl lg:text-5xl">
              Making Food Rescue Simple
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = {
                emerald: "bg-emerald-100 text-emerald-700",
                blue: "bg-blue-100 text-blue-700",
                purple: "bg-purple-100 text-purple-700",
              };

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="rounded-3xl bg-white p-6 shadow-md border border-slate-200/80 transition-all duration-300 hover:shadow-xl sm:p-8"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${colors[feature.color as keyof typeof colors]}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 bg-slate-50 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">
              Real Stories, Real Impact
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white p-6 shadow-md border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">"{t.quote}"</p>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                    {t.image}
                  </div>
                  <div>
                    <p className="font-bold text-emerald-950 text-xs sm:text-sm">{t.author}</p>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOME PAGE FAQ SECTION */}
      <section className="py-16 bg-white sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              FAQ Answers
            </span>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Quick answers about food donation, NGO requests, and volunteer dispatches.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs transition hover:border-emerald-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={18} className="text-emerald-600 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-emerald-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed sm:text-sm border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 sm:text-sm"
            >
              View More FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}