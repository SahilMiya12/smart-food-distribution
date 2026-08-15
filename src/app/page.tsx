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
  Leaf,
  Star,
  Package,
  CheckCircle,
  Sparkles,
  Rocket,
  Shield,
  Clock,
  Award,
  Globe,
  Zap,
  Target,
  Bell,
  TrendingUp,
  BarChart,
  MapPin,
  Calendar,
  Utensils,
  ShoppingBag,
  Building2,
  Bike,
  Coffee,
  Apple,
  Wheat,
  Fish,
  Milk,
  Cake,
  Pizza,
  ChefHat,
  Store,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  Send,
  Loader2,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    setIsVisible(true);
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
    { icon: Coffee, name: "Beverages", count: "124", color: "from-amber-400 to-orange-400" },
    { icon: Apple, name: "Fresh Fruits", count: "89", color: "from-red-400 to-rose-400" },
    { icon: Wheat, name: "Grains", count: "56", color: "from-yellow-400 to-amber-400" },
    { icon: Fish, name: "Seafood", count: "34", color: "from-cyan-400 to-blue-400" },
    { icon: Milk, name: "Dairy", count: "67", color: "from-sky-400 to-blue-400" },
    { icon: Cake, name: "Bakery", count: "78", color: "from-pink-400 to-rose-400" },
    { icon: Pizza, name: "Prepared Meals", count: "92", color: "from-orange-400 to-red-400" },
    { icon: ChefHat, name: "Catering", count: "45", color: "from-indigo-400 to-purple-400" },
  ];

  const testimonials = [
    {
      quote: "FoodBridge has transformed how we serve our community. We've been able to provide 3x more meals with less waste.",
      author: "Sarah Johnson",
      role: "Executive Director, City Food Bank",
      initials: "SJ",
      rating: 5,
      image: "👩‍💼",
    },
    {
      quote: "As a small restaurant, we used to throw away so much food. Now we donate it and feel good knowing it helps people.",
      author: "Michael Chen",
      role: "Owner, Green Leaf Cafe",
      initials: "MC",
      rating: 5,
      image: "👨‍🍳",
    },
    {
      quote: "Volunteering through FoodBridge has been incredibly rewarding. I've delivered over 200 meals in my neighborhood.",
      author: "Priya Patel",
      role: "Volunteer",
      initials: "PP",
      rating: 5,
      image: "👩‍🌾",
    },
    {
      quote: "The platform is so easy to use. We've been able to coordinate food distribution seamlessly with our partner NGOs.",
      author: "David Kim",
      role: "Operations Manager, Food Rescue",
      initials: "DK",
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
      q: "Is FoodBridge free to use?",
      a: "Yes! FoodBridge is completely free for donors, NGOs, and volunteers.",
    },
    {
      q: "Who can donate food?",
      a: "Anyone with surplus food can donate — restaurants, grocery stores, catering services, and individuals.",
    },
    {
      q: "What types of food can be donated?",
      a: "Prepared meals, fresh produce, packaged goods, bakery items, and more. Ensure food is safe and within expiry.",
    },
    {
      q: "How do NGOs receive food?",
      a: "NGOs browse available donations, request food, and once approved, volunteers deliver it.",
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
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-300"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 pt-20 pb-16 lg:pt-28">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0"
        >
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-2xl" />
        </motion.div>

        <div className="container relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Sparkles size={16} className="text-emerald-600" />
                  </motion.span>
                  Together for a better tomorrow
                </div>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl font-bold leading-tight text-emerald-950 md:text-6xl lg:text-7xl">
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

              <motion.p variants={fadeInUp} className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Connect surplus food with people who need it. Together, we can
                reduce food waste and build a better tomorrow for our communities.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40"
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

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/how-it-works"
                    className="flex items-center gap-2 rounded-2xl border-2 border-emerald-700 px-7 py-4 font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D", "E"].map((letter, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.8 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-200 to-emerald-300 text-sm font-bold text-emerald-700 shadow-lg"
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
                  <p className="text-sm text-gray-500">Trusted by 500+ organizations</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative flex h-[450px] items-center justify-center rounded-[40px] bg-gradient-to-br from-emerald-200 via-emerald-100 to-teal-100 lg:h-[550px]">
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-emerald-500/10 to-teal-500/10" />

                {/* Floating cards */}
                {[
                  { icon: Package, label: "Today's Donations", value: "124", color: "emerald", pos: "-left-4 -top-4 lg:-left-8 lg:-top-8" },
                  { icon: Users, label: "Active NGOs", value: "320+", color: "blue", pos: "-bottom-4 -right-4 lg:-bottom-8 lg:-right-8" },
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
                      className={`absolute ${card.pos} rounded-2xl bg-white p-4 shadow-xl backdrop-blur-sm`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${colors[card.color as keyof typeof colors]}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{card.label}</p>
                          <p className="text-lg font-bold">{card.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Center Icon */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <HandHeart size={70} className="text-emerald-700" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-emerald-950">Every Meal Matters</h3>
                  <p className="mt-1 text-gray-600">Small actions. Big impact.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 55C120 50 240 40 360 45C480 50 600 70 720 75C840 80 960 70 1080 60C1200 50 1320 40 1380 35L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z" fill="#f8faf8" />
          </svg>
        </motion.div>
      </section>

      {/* IMPACT STATS */}
      <section className="relative -mt-1 bg-[#f8faf8] pb-16">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-4 rounded-3xl bg-white p-6 shadow-xl md:grid-cols-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-emerald-50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-200">
                    <Icon size={28} />
                  </div>
                  <div>
                    <motion.p
                      className="text-2xl font-bold text-emerald-950"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: index * 0.1 + 0.3 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-emerald-600">{stat.trend}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FOOD CATEGORIES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Food Categories
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Popular Food Donations
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Browse available food categories and find what your community needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {foodCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -8 }}
                  onHoverStart={() => setHoveredCategory(category.name)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${category.color.split(' ')[1]} 0%, ${category.color.split(' ')[3]} 100%)`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-black/10"
                    animate={{
                      opacity: hoveredCategory === category.name ? 0.2 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Icon size={32} className="mb-3" />
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} donations</p>
                  <motion.div
                    className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20"
                    animate={{
                      scale: hoveredCategory === category.name ? 1.5 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50/30">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Simple Process
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Four simple steps to make a big impact in your community.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-4"
          >
            {[
              { icon: HandHeart, title: "Donate Food", description: "Share surplus food from your home, restaurant, or business.", color: "emerald" },
              { icon: Users, title: "NGO Requests", description: "NGOs find and request the food they need.", color: "blue" },
              { icon: Truck, title: "Volunteer Delivers", description: "Volunteers pick up and deliver food to NGOs.", color: "purple" },
              { icon: Heart, title: "Community Impact", description: "Food reaches people who need it most.", color: "rose" },
            ].map((step, index) => {
              const Icon = step.icon;
              const colors = {
                emerald: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200",
                blue: "bg-blue-100 text-blue-700 group-hover:bg-blue-200",
                purple: "bg-purple-100 text-purple-700 group-hover:bg-purple-200",
                rose: "bg-rose-100 text-rose-700 group-hover:bg-rose-200",
              };

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="group text-center"
                >
                  <motion.div
                    className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${colors[step.color as keyof typeof colors]} transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon size={32} />
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-lg">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.div>
                  <h3 className="mt-5 text-xl font-bold text-emerald-950">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Why FoodBridge
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Making Food Rescue Simple
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Everything you need to connect surplus food with communities in need.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-3"
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
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
                >
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors[feature.color as keyof typeof colors]} transition-all duration-300 group-hover:scale-110`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.items.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle size={16} className="text-emerald-600" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Real Stories, Real Impact
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Hear from our community members who are making a difference.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div className="mb-3 flex text-emerald-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">"{testimonial.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS AND ACHIEVEMENTS */}
      <section className="relative overflow-hidden py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Our Achievements
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Making a Difference Every Day
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Together, we're creating a sustainable future for our communities.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: TrendingUp, value: "250%", label: "Growth in Donations", color: "emerald" },
              { icon: Globe, value: "50+", label: "Cities Covered", color: "blue" },
              { icon: Users, value: "5K+", label: "Active Volunteers", color: "purple" },
              { icon: Shield, value: "100%", label: "Food Safety Rate", color: "rose" },
            ].map((stat, index) => {
              const Icon = stat.icon;
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
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-3xl bg-gradient-to-br from-slate-50 to-gray-50 p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl"
                >
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${colors[stat.color as keyof typeof colors]} shadow-md`}>
                    <Icon size={32} />
                  </div>
                  <p className="mt-4 text-4xl font-bold text-emerald-950">{stat.value}</p>
                  <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#f8faf8]">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Everything you need to know about FoodBridge.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-emerald-950 transition-colors duration-300 hover:text-emerald-700">
                  {faq.q}
                  <ChevronDown
                    size={20}
                    className="text-emerald-600 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 font-semibold text-emerald-700 transition-all duration-300 hover:text-emerald-800"
            >
              View all FAQs
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="container relative mx-auto max-w-7xl px-6 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Rocket className="h-12 w-12" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold md:text-5xl"
          >
            Ready to Make an Impact?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100"
          >
            Join thousands of donors, NGOs, and volunteers who are already
            reducing food waste and feeding communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-emerald-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                Get Started Free
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="rounded-2xl border border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-sm text-emerald-200"
          >
            🚀 Free for all users. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Trusted by Organizations Worldwide
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-opacity duration-300 hover:opacity-100">
              {[
                "🏢 Food Bank Network",
                "🍽️ Restaurants United",
                "🌾 Farm to Table",
                "🤝 Community First",
                "🌱 Green Initiative",
                "❤️ Care Foundation",
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg font-semibold text-gray-400"
                >
                  {partner}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}