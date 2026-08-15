"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is FoodBridge?",
          a: "FoodBridge is a smart food distribution platform that connects food donors, NGOs, and volunteers to reduce food waste and fight hunger in communities.",
        },
        {
          q: "Is FoodBridge free to use?",
          a: "Yes! FoodBridge is completely free for donors, NGOs, and volunteers. There are no hidden fees or charges.",
        },
        {
          q: "How does FoodBridge work?",
          a: "Donors list surplus food, NGOs request what they need, and volunteers help with delivery. It's a simple three-step process that connects everyone.",
        },
      ],
    },
    {
      category: "For Donors",
      questions: [
        {
          q: "Who can donate food?",
          a: "Anyone with surplus food can donate — restaurants, grocery stores, catering services, bakeries, farms, and even individuals with extra food.",
        },
        {
          q: "What types of food can be donated?",
          a: "Prepared meals, fresh produce, packaged goods, bakery items, dairy products, and more. All food must be safe, properly packaged, and within expiry date.",
        },
        {
          q: "How do I list a donation?",
          a: "Simply create an account as a donor, go to your dashboard, click 'Create Donation', and fill in the details about your food.",
        },
      ],
    },
    {
      category: "For NGOs",
      questions: [
        {
          q: "How do NGOs receive food?",
          a: "NGOs browse available donations, request food they need, and once approved by the donor, volunteers deliver it.",
        },
        {
          q: "What documents do NGOs need?",
          a: "NGOs need to provide their organization name, registration details, and contact information during registration.",
        },
        {
          q: "Can NGOs request multiple donations?",
          a: "Yes, NGOs can request as many donations as they need to serve their communities.",
        },
      ],
    },
    {
      category: "For Volunteers",
      questions: [
        {
          q: "How do I become a volunteer?",
          a: "Simply sign up as a volunteer, complete your profile, and start accepting delivery requests near you.",
        },
        {
          q: "Do I need a vehicle to volunteer?",
          a: "Not necessarily. Some deliveries may require a vehicle, but you can choose deliveries that match your transportation capabilities.",
        },
        {
          q: "How much time do I need to commit?",
          a: "You choose your own schedule. Pick up deliveries that fit your availability — no minimum commitment required.",
        },
      ],
    },
    {
      category: "Safety & Quality",
      questions: [
        {
          q: "How is food safety ensured?",
          a: "Donors must ensure food is safe, properly packaged, and within expiry. NGOs inspect food upon delivery.",
        },
        {
          q: "What if food is damaged or expired?",
          a: "If food is damaged or expired, NGOs can report the issue. We take food safety very seriously.",
        },
        {
          q: "Are donations traceable?",
          a: "Yes, all donations are tracked from listing to delivery, ensuring complete transparency.",
        },
      ],
    },
  ];

  const filteredFaqs = searchTerm
    ? faqs
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.a.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqs;

  return (
    <MainLayout>
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-700">Everything you need to know about FoodBridge.</p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8faf8]">
        <div className="container mx-auto max-w-4xl px-6">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center">
              <p className="text-lg text-slate-500">No results found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-emerald-950">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = categoryIndex * 10 + index;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="flex w-full items-center justify-between p-6 text-left"
                        >
                          <span className="font-semibold text-emerald-950">{faq.q}</span>
                          <ChevronDown
                            size={20}
                            className={`text-emerald-600 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-16 bg-emerald-900">
        <div className="container mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="text-3xl font-bold">Still have questions?</h2>
          <p className="mt-4 text-emerald-100">Can't find the answer you're looking for? We're here to help.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50">
              Contact Us
            </Link>
            <a href="mailto:hello@foodbridge.org" className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              hello@foodbridge.org
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}