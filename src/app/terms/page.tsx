import Link from "next/link";
import { FileText, CheckCircle, AlertCircle, Users, Shield, Mail, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function TermsPage() {
  return (
    <MainLayout>
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <FileText className="h-10 w-10 text-emerald-700" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">Terms of Service</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-700">Please read these terms carefully before using FoodBridge.</p>
          <p className="mt-2 text-sm text-emerald-600">Last updated: December 2024</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-emerald-950">Community</h3>
              <p className="text-sm text-slate-600">Built for everyone</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <Shield className="mx-auto h-8 w-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-emerald-950">Safety</h3>
              <p className="text-sm text-slate-600">Protecting our users</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-emerald-950">Trust</h3>
              <p className="text-sm text-slate-600">Transparent policies</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-emerald-950">1. Acceptance of Terms</h2>
              <p className="mt-4 text-slate-600">By creating an account or using FoodBridge, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">2. User Accounts</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p><strong>Registration:</strong> You must provide accurate information when creating an account. You are responsible for maintaining the security of your account.</p>
                <p><strong>Eligibility:</strong> You must be 18 years or older to use FoodBridge. By registering, you confirm that you meet this requirement.</p>
                <p><strong>Account Types:</strong> FoodBridge offers three account types:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Donor:</strong> Individuals or organizations donating food</li>
                  <li><strong>NGO:</strong> Organizations requesting and distributing food</li>
                  <li><strong>Volunteer:</strong> Individuals helping with food delivery</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">3. User Responsibilities</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>By using FoodBridge, you agree to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Provide accurate information</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not misuse the platform or interfere with others' use</li>
                  <li>Respect other users and their privacy</li>
                  <li>Report any issues or violations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">4. Food Safety Guidelines</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">Important</p>
                      <p className="text-sm text-amber-700">Donors must ensure all food is safe, properly packaged, and within expiry date. Food that is expired or unsafe must not be donated.</p>
                    </div>
                  </div>
                </div>
                <p>Donors must:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Provide accurate food descriptions</li>
                  <li>Ensure food is properly stored and handled</li>
                  <li>Inform NGOs of any allergens or special considerations</li>
                  <li>Cancel donations that are no longer available</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">5. Delivery Responsibilities</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p><strong>Volunteers:</strong> Ensure timely and safe delivery of food to NGOs. Follow all traffic and safety regulations.</p>
                <p><strong>NGOs:</strong> Be available to receive deliveries. Inspect food quality and report any issues promptly.</p>
                <p><strong>Donors:</strong> Prepare food for pickup. Provide clear pickup instructions.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">6. Prohibited Activities</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>You may not:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Use the platform for illegal purposes</li>
                  <li>Harass or harm other users</li>
                  <li>List unsafe or expired food</li>
                  <li>Misrepresent your identity or organization</li>
                  <li>Share your account credentials</li>
                  <li>Attempt to bypass security measures</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">7. Termination</h2>
              <p className="mt-4 text-slate-600">We reserve the right to terminate accounts that violate these terms or engage in harmful behavior. You may also delete your account at any time.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-950">8. Contact Us</h2>
              <div className="mt-4 space-y-4 text-slate-600">
                <p>If you have questions about these Terms of Service, please contact us:</p>
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