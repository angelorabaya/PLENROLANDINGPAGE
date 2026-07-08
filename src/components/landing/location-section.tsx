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
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Office Location &amp; Contact
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
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
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Office Address</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Ground Floor MISORTEL Building,<br />
                    A. Luna St., Cagayan de Oro City,<br />
                    Misamis Oriental, Philippines
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Phone className="text-teal-600 dark:text-teal-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone Number</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    (088) 856-3355
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Mail className="text-cyan-600 dark:text-cyan-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email Address</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    plenro.misor@gmail.com
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="rounded-2xl p-5 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Clock className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Office Hours</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
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
              className="mt-6 lg:mt-0 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-300 group"
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
