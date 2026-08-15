"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageSquare, Clock, Globe, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@foodbridge.org", href: "mailto:hello@foodbridge.org", color: "emerald" },
    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567", color: "blue" },
    { icon: MapPin, label: "Address", value: "123 FoodBridge Lane, New York, NY 10001", color: "purple" },
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
              type: "spring" as const,
              stiffness: 260,
              damping: 20,
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 shadow-xl"
          >
            <MessageSquare className="h-12 w-12 text-emerald-700" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-emerald-950 md:text-6xl"
          >
            Get in <span className="text-emerald-600">Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-emerald-700"
          >
            Have questions or want to partner with us? We'd love to hear from you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
              <Clock size={16} className="text-emerald-600" />
              <span className="text-sm text-emerald-700">24hr Response</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
              <Globe size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">Global Support</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
              <Users size={16} className="text-purple-600" />
              <span className="text-sm text-purple-700">Dedicated Team</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-12 lg:grid-cols-2"
          >
            {/* Form */}
            <motion.div variants={fadeInUp} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-emerald-950">Send Us a Message</h2>
              <p className="mt-2 text-slate-500">We'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {[
                  { name: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map((field) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
                  >
                    <CheckCircle size={18} />
                    Message sent successfully!
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-emerald-950">Contact Information</h3>

                <div className="mt-6 space-y-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    const colors = {
                      emerald: "bg-emerald-200 text-emerald-700",
                      blue: "bg-blue-200 text-blue-700",
                      purple: "bg-purple-200 text-purple-700",
                    };

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center gap-4 rounded-2xl bg-white/50 p-4 backdrop-blur-sm transition-all duration-300"
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[item.color as keyof typeof colors]}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-slate-600 hover:text-emerald-600 transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-slate-600">{item.value}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-emerald-950">Office Hours</h3>
                <div className="mt-6 space-y-4 text-slate-600">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span>{item.day}</span>
                      <span className="font-medium text-emerald-700">{item.hours}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-lg"
              >
                <h3 className="text-xl font-bold">Emergency Support</h3>
                <p className="mt-2 text-emerald-100">
                  For urgent matters, our support team is available 24/7.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Phone size={20} />
                  <a href="tel:+15551234567" className="text-lg font-bold hover:text-emerald-100 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}