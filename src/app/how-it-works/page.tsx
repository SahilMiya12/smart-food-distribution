"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HandHeart, Truck, Users, Heart, ArrowRight, CheckCircle, Sparkles, Rocket, Target, Zap } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function HowItWorksPage() {
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
        staggerChildren: 0.2,
      },
    },
  };

  const steps = [
    {
      number: "01",
      icon: HandHeart,
      title: "Donate Food",
      description: "Share your surplus food by creating a donation listing. Include details like food type, quantity, expiry date, and pickup location.",
      color: "from-emerald-400 to-teal-400",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100 text-emerald-700",
      emoji: "🍽️",
    },
    {
      number: "02",
      icon: Users,
      title: "NGO Requests",
      description: "NGOs browse available donations and request the food they need. Donors receive and review these requests in real-time.",
      color: "from-blue-400 to-cyan-400",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100 text-blue-700",
      emoji: "🏢",
    },
    {
      number: "03",
      icon: Truck,
      title: "Volunteer Delivery",
      description: "Once a request is approved, volunteers are assigned to pick up the food and deliver it to the requesting NGO.",
      color: "from-purple-400 to-pink-400",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100 text-purple-700",
      emoji: "🚚",
    },
    {
      number: "04",
      icon: Heart,
      title: "Community Impact",
      description: "Food reaches people in need, reducing waste and fighting hunger. Every donation makes a real difference in someone's life.",
      color: "from-rose-400 to-red-400",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100 text-rose-700",
      emoji: "❤️",
    },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 py-20">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
        </motion.div>

        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 shadow-xl"
          >
            <Rocket className="h-12 w-12 text-emerald-700" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-emerald-950 md:text-6xl"
          >
            How <span className="text-emerald-600">FoodBridge</span> Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-xl text-emerald-700"
          >
            A simple, transparent process to reduce food waste and feed communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm text-emerald-700">100% Free</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
              <CheckCircle size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">Instant Matching</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
              <CheckCircle size={16} className="text-purple-600" />
              <span className="text-sm text-purple-700">Real-time Tracking</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
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
              Four Steps to Make a Difference
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Everything you need to know about how FoodBridge connects surplus food with communities.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 space-y-16"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;

              return (
                <motion.div
                  key={step.number}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className={`flex flex-col items-center gap-8 lg:flex-row ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.iconBg} shadow-md`}
                      >
                        <Icon className="h-8 w-8" />
                      </motion.div>
                      <div>
                        <span className="text-sm font-bold text-emerald-600">
                          Step {step.number}
                        </span>
                        <h3 className="text-2xl font-bold text-emerald-950">{step.title}</h3>
                      </div>
                    </div>

                    <p className="mt-4 text-lg leading-8 text-slate-600">{step.description}</p>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                        <Zap size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Fast</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                        <Target size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Focused</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2">
                        <Sparkles size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Impactful</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    className={`flex h-64 w-full items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} p-8 shadow-lg lg:w-96`}
                  >
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">{step.emoji}</div>
                      <p className="text-lg font-bold">Step {step.number}</p>
                      <p className="text-sm opacity-90">{step.title}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Video/Stats Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold md:text-5xl"
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100"
          >
            Join thousands of donors, NGOs, and volunteers making a difference.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {[
              { label: "Active Users", value: "25K+", icon: "👥" },
              { label: "Monthly Donations", value: "1.2K+", icon: "📦" },
              { label: "Success Rate", value: "99.9%", icon: "🎯" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl bg-white/10 backdrop-blur-sm p-6"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-emerald-200">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-emerald-900 transition-all duration-300 hover:shadow-xl"
              >
                Get Started Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}