'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export default function LocationSection() {
  const address = "Ground Floor MISORTEL Building, A. Luna St., Cagayan de Oro City, Philippines";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="contact" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Office Location &amp; Contact
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Visit our office or get in touch with our team for permit assistance and regulatory queries.
          </p>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Left Column: Contact Cards (2/5 span) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-4 justify-between"
          >
            <div className="space-y-4">
              {/* Address Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 flex gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/25 dark:hover:border-emerald-500/15 active:scale-[0.99] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-all duration-300 animate-pulse">
                  <MapPin className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white mb-1 text-base">Office Address</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    Ground Floor MISORTEL Building,<br />
                    A. Luna St., Cagayan de Oro City,<br />
                    Misamis Oriental, Philippines
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 flex gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/5 hover:border-teal-500/25 dark:hover:border-teal-500/15 active:scale-[0.99] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-all duration-300 animate-pulse">
                  <Phone className="text-teal-600 dark:text-teal-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white mb-1 text-base">Phone Number</h4>
                  <a 
                    href="tel:09627484966"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-655 dark:hover:text-teal-400 transition-colors leading-relaxed font-semibold"
                  >
                    09627484966
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 flex gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/5 hover:border-cyan-500/25 dark:hover:border-cyan-500/15 active:scale-[0.99] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-all duration-300 animate-pulse">
                  <Mail className="text-cyan-600 dark:text-cyan-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white mb-1 text-base">Email Address</h4>
                  <a 
                    href="mailto:emd.enromisor@gmail.com"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-relaxed font-semibold"
                  >
                    emd.enromisor@gmail.com
                  </a>
                </div>
              </div>

              {/* Hours Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 flex gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/25 dark:hover:border-amber-500/15 active:scale-[0.99] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-all duration-300 animate-pulse">
                  <Clock className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white mb-1 text-base">Office Hours</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    Monday to Friday<br />
                    8:00 AM – 5:00 PM (except holidays)
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Directions Action */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 lg:mt-0 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-650 to-teal-600 hover:scale-105 active:scale-95 text-white font-semibold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-300 group cursor-pointer"
            >
              <Navigation className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Get Directions on Google Maps
            </a>
          </motion.div>

          {/* Right Column: Google Maps Embed (3/5 span) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 min-h-[350px] lg:min-h-full rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-inner relative bg-white dark:bg-gray-800"
          >
            <iframe
              title="PLENRO Misamis Oriental Office Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
