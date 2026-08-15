import Link from "next/link";
import { Shield, Lock, Eye, Database, Mail, Cookie, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Shield className="h-10 w-10 text-emerald-700" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-700">Your privacy matters to us. Here's how we protect your data.</p>
          <p className="mt-2 text-sm text-emerald-600">Last updated: December 2024</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950">Data Security</h3>
              </div>
              <p className="text-sm text-slate-600">We use industry-standard encryption to protect your personal information.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950">Transparency</h3>
              </div>
              <p className="text-sm text-slate-600">We're transparent about what data we collect and how we use it.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950">Data Control</h3>
              </div>
              <p className="text-sm text-slate-600">You have full control over your data and can request deletion at any time.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Cookie className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950">Cookies</h3>
              </div>
              <p className="text-sm text-slate-600">We use cookies to improve your experience and remember your preferences.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-emerald-950">1. Information We Collect</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p><strong>Personal Information:</strong> When you create an account, we collect your name, email address, phone number, and role (Donor, NGO, or Volunteer).</p>
                <p><strong>Usage Data:</strong> We collect information about how you use our platform, including donations, requests, and deliveries.</p>
                <p><strong>Location Data:</strong> We may collect your location to connect you with nearby donors, NGOs, and volunteers.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">2. How We Use Your Information</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
                <li>To create and manage your account</li>
                <li>To facilitate food donations, requests, and deliveries</li>
                <li>To send you notifications about activities and updates</li>
                <li>To improve our platform and user experience</li>
                <li>To ensure compliance with food safety regulations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">3. Information Sharing</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>We share your information only with necessary parties:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Donors:</strong> NGOs and volunteers see donor details for delivery coordination</li>
                  <li><strong>NGOs:</strong> Donors see NGO details to approve food requests</li>
                  <li><strong>Volunteers:</strong> Donors and NGOs see volunteer details for delivery coordination</li>
                </ul>
                <p>We never sell your personal information to third parties.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">4. Data Security</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>256-bit SSL encryption for all data transmission</li>
                  <li>Secure password hashing with bcrypt</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">5. Your Rights</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>You have the right to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of communications</li>
                  <li>Export your data</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">6. Contact Us</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="rounded-2xl bg-slate-50 p-6">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span>hello@foodbridge.org</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}