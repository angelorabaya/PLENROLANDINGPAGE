"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-gray-900 dark:bg-gray-950 text-white overflow-hidden">
      {/* Wave SVG Divider */}
      <div className="w-full overflow-hidden leading-[0] bg-gray-50/50 dark:bg-gray-900/50">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 text-gray-900 dark:text-gray-950 fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C122.58,4.1,235.08,53.34,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
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
                <a href="tel:09627484966" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">09627484966</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:emd.enromisor@gmail.com" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">emd.enromisor@gmail.com</a>
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
                { label: "Our Team", href: "#team" },
                { label: "Regulatory Framework", href: "#regulatory-framework" },
                { label: "Latest News", href: "#news" },
                { label: "Public Resources", href: "#resources" },
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
                { label: "Provincial Government", url: "https://www.misamisoriental.gov.ph/" },
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
                href="https://www.facebook.com/profile.php?id=61581984893275"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:border-emerald-500/40 group"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://www.misamisoriental.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:border-amber-500/40 group"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Gradient separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mt-12 mb-8" />

        {/* Bottom bar */}
        <div className="pt-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              © {currentYear} Provincial Local Environment and Natural Resources Office — Misamis Oriental. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Misamis Oriental Logo"
                className="w-5 h-5 object-contain"
              />
              <p className="text-xs text-gray-500">
                Provincial Government of Misamis Oriental
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
