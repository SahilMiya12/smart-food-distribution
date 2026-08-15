"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Target, Globe, Leaf, ArrowRight, Users, Award, Zap, Shield, Sparkles } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function AboutPage() {
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

  const features = [
    { icon: Users, title: "500+", description: "Active NGOs" },
    { icon: Award, title: "15K+", description: "Meals Rescued" },
    { icon: Zap, title: "99.9%", description: "Delivery Success" },
    { icon: Shield, title: "100%", description: "Food Safety" },
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
            <Heart className="h-12 w-12 text-emerald-700" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-emerald-950 md:text-6xl"
          >
            About <span className="text-emerald-600">FoodBridge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-xl text-emerald-700"
          >
            Connecting surplus food with communities in need.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600"
          >
            FoodBridge is a smart food distribution platform that connects
            food donors, NGOs, and volunteers to reduce food waste and
            fight hunger in our communities.
          </motion.p>

          {/* Stats Banner */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-3">
                      <Icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-emerald-950">{feature.title}</p>
                      <p className="text-sm text-slate-500">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Who We Are
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 md:text-5xl">
              Our Mission, Vision & Values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Guiding principles that drive everything we do.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To eliminate food waste by creating an efficient, transparent platform that connects surplus food with communities in need.",
                gradient: "from-emerald-50 to-teal-50",
                color: "emerald",
              },
              {
                icon: Globe,
                title: "Our Vision",
                description: "A world where no food goes to waste and everyone has access to nutritious meals.",
                gradient: "from-blue-50 to-cyan-50",
                color: "blue",
              },
              {
                icon: Leaf,
                title: "Our Values",
                description: "Transparency, compassion, sustainability, and community-driven action to create lasting change.",
                gradient: "from-purple-50 to-pink-50",
                color: "purple",
              },
            ].map((item, index) => {
              const Icon = item.icon;
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
                  className={`rounded-3xl bg-gradient-to-br ${item.gradient} p-8 text-center shadow-lg transition-all duration-300`}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors[item.color as keyof typeof colors]} shadow-md`}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-emerald-950">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 py-20">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        </motion.div>

        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white md:text-5xl"
          >
            Our Impact in Numbers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100"
          >
            Together, we're making a real difference.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-6 md:grid-cols-4"
          >
            {[
              { value: "15K+", label: "Meals Rescued", icon: "🍽️" },
              { value: "320+", label: "NGO Partners", icon: "🏢" },
              { value: "8K+", label: "Active Volunteers", icon: "🤝" },
              { value: "12K+", label: "Lives Impacted", icon: "❤️" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-3xl bg-white/10 backdrop-blur-sm p-8 text-center transition-all duration-300"
              >
                <div className="text-5xl mb-2">{stat.icon}</div>
                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: index * 0.1 + 0.3,
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="mt-2 text-emerald-200">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-emerald-950">Join the FoodBridge Movement</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Whether you're a donor, NGO, or volunteer, your contribution matters.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-block"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40"
              >
                Get Started
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