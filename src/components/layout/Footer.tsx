"use client";

import Link from "next/link";
import { Heart, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-emerald-200">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <Heart className="fill-emerald-400 text-emerald-400" size={28} />
              <span>FoodBridge</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-300">
              Smart food distribution platform connecting surplus food with
              communities in need. Reducing waste, fighting hunger.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href="#" label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm text-emerald-300">Email</p>
                  <a href="mailto:hello@foodbridge.org" className="text-sm text-white hover:text-emerald-300">
                    hello@foodbridge.org
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm text-emerald-300">Phone</p>
                  <a href="tel:+15551234567" className="text-sm text-white hover:text-emerald-300">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm text-emerald-300">Address</p>
                  <p className="text-sm text-white">123 FoodBridge Lane, New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-800" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="text-emerald-400">&copy; {currentYear} FoodBridge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy</Link>
            <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms</Link>
            <span className="flex items-center gap-1 text-emerald-400">
              Made with <Heart size={14} className="fill-red-400 text-red-400" /> for a better world
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 text-emerald-300 transition hover:bg-emerald-700 hover:text-white hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group inline-flex items-center gap-1 text-sm text-emerald-300 transition hover:text-white">
        {children}
        <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </li>
  );
}