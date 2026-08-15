"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, HandHeart, Package, Users, Star, Sparkles, Shield, Clock } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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

  const floatingCards = [
    { icon: Package, label: "Today's Donations", value: "124", color: "emerald" },
    { icon: Users, label: "Active NGOs", value: "320+", color: "blue" },
    { icon: Shield, label: "Safe Delivery", value: "99.9%", color: "purple" },
    { icon: Clock, label: "Avg Response", value: "< 2hrs", color: "amber" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 pt-28 pb-20 lg:pt-36">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-2xl"
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Left Content */}
          <div>
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Heart size={16} className="fill-emerald-700" />
                </motion.span>
                Together for a better tomorrow
                <Sparkles size={14} className="ml-1" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-bold leading-tight text-emerald-950 md:text-6xl lg:text-7xl"
            >
              Share More.
              <br />
              Waste Less.
              <br />
              <motion.span
                className="relative text-emerald-700"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear" as const,
                }}
                style={{
                  background: "linear-gradient(90deg, #065f46, #0d9488, #065f46)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Feed Everyone.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-lg leading-8 text-gray-600"
            >
              Connect surplus food with people who need it. Together, we can
              reduce food waste and build a better tomorrow for our communities.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
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

            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D", "E"].map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.8 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-200 to-emerald-300 text-sm font-bold text-emerald-700"
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
          </div>

          {/* Right Content */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative flex h-[450px] items-center justify-center rounded-[40px] bg-gradient-to-br from-emerald-200 via-emerald-100 to-teal-100 lg:h-[550px]">
              {/* Floating Cards */}
              {floatingCards.map((card, index) => {
                const Icon = card.icon;
                const positions = [
                  "absolute -left-4 -top-4 lg:-left-8 lg:-top-8",
                  "absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8",
                  "absolute top-1/4 -right-2 lg:-right-4",
                  "absolute bottom-1/4 -left-2 lg:-left-4",
                ];
                const colors = {
                  emerald: "bg-emerald-100 text-emerald-700",
                  blue: "bg-blue-100 text-blue-700",
                  purple: "bg-purple-100 text-purple-700",
                  amber: "bg-amber-100 text-amber-700",
                };

                return (
                  <motion.div
                    key={index}
                    className={`${positions[index]} rounded-2xl bg-white p-4 shadow-xl backdrop-blur-sm`}
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
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
        </motion.div>
      </div>

      {/* Animated Wave Divider */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L60 55C120 50 240 40 360 45C480 50 600 70 720 75C840 80 960 70 1080 60C1200 50 1320 40 1380 35L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z"
            fill="#f8faf8"
          />
        </svg>
      </motion.div>
    </section>
  );
}