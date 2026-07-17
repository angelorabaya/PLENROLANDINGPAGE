'use client'

import { motion } from 'framer-motion'
import { ExternalLink, CheckSquare, MessageSquare } from 'lucide-react'

const keyActivities = [
  {
    title: 'Capacity Building & Safety',
    description: 'Skills and safety training for local miners to enforce regulatory compliance inside Minahang Bayan areas.',
  },
  {
    title: 'Joint Checkpoint Enforcement',
    description: 'Joint operations with law enforcement to intercept unauthorized mineral ore and quarry shipments.',
  },
  {
    title: 'Provincial Bamboo Reforestation',
    description: 'Ecosystem rehabilitation and planting programs addressing soil erosion and supporting local livelihoods.',
  },
  {
    title: 'Coastal Zone Management',
    description: 'Partnerships to expand green ecotourism and implement sustainable coastal development guidelines.',
  },
]

export default function NewsSection() {
  return (
    <section id="news" className="py-24 px-6 bg-white dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        
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
            Latest Activities &amp; Implementations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Stay updated with our real-world programs driving regulatory compliance, environmental protection, and community development.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context and Core Programs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                Live updates directly from the field
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                We regularly post updates, regulatory announcements, and field implementation photos on our official Facebook Page. Check the live feed on the right to see our latest works.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Key Initiatives
              </h4>
              <div className="grid gap-4">
                {keyActivities.map((act, index) => {
                  const isGold = index % 2 === 1;
                  return (
                    <div 
                      key={index} 
                      className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 dark:hover:border-emerald-500/10 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isGold ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                      }`}>
                        <CheckSquare className={`w-4 h-4 ${isGold ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                      </div>
                      <div>
                        <h5 className="font-display font-semibold text-sm text-gray-900 dark:text-white">
                          {act.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed font-medium">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61581984893275"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-105 active:scale-95 text-sm cursor-pointer"
              >
                Follow our Facebook Page
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Live Facebook Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 w-full flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[500px] h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 relative">
              
              {/* Dynamic Loading Indicator behind iframe */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900/50 -z-10 text-gray-400 dark:text-gray-500 gap-2">
                <MessageSquare className="w-8 h-8 animate-pulse text-emerald-500" />
                <span className="text-xs">Loading Live Facebook Feed...</span>
              </div>

              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61581984893275&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false"
                width="100%"
                height="100%"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="w-full h-full rounded-2xl"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
