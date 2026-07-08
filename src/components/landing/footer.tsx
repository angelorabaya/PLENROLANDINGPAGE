"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-gray-900 dark:bg-gray-950 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/plenro.png"
                alt="PLENRO Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  PLENRO
                </h3>
                <p className="text-xs text-gray-400">Misamis Oriental</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The Provincial Local Environment and Natural Resources Office — championing environmental stewardship and responsible resource regulation for a sustainable Misamis Oriental.
            </p>
          </motion.div>

          {/* Column 2: Office Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Office Details
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Ground Floor MISORTEL Building,<br />
                  A. Luna St., Cagayan de Oro City,<br />
                  Philippines
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-gray-400">(088) 856-3355</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-gray-400">plenro.misor@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-gray-400">Mon–Fri, 8:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Mandate & Role", href: "#mandate" },
                { label: "Regulatory Framework", href: "#regulatory-framework" },
                { label: "Latest News", href: "#news" },
                { label: "Public Resources", href: "#resources" },
                { label: "Download Ordinance", href: "/PLENRO ORDINANCE.docx" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Connected Agencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Connected Agencies
            </h4>
            <ul className="space-y-2">
              {[
                { label: "DENR Region 10", url: "https://r10.denr.gov.ph" },
                { label: "Mines & Geosciences Bureau X", url: "https://mgb.gov.ph" },
                { label: "EMB Region 10", url: "https://emb.gov.ph" },
                { label: "Provincial Government", url: "https://misamisoriental.gov.ph" },
              ].map((agency) => (
                <li key={agency.label}>
                  <a
                    href={agency.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {agency.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com/plenro.misor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://misamisoriental.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {currentYear} Provincial Local Environment and Natural Resources Office — Misamis Oriental. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Misamis Oriental Logo"
                className="w-5 h-5 object-contain"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Provincial Government of Misamis Oriental
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
