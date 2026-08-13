'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme } from './theme-provider';
import ThemeToggle from './theme-toggle';

const navLinks = [
  { label: 'Message', href: '#message' },
  { label: 'Mandate', href: '#mandate' },
  { label: 'Team', href: '#team' },
  { label: 'Regulations', href: '#regulatory-framework' },
  { label: 'News', href: '#news' },
  { label: 'Process Flow', href: '#process-flow' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: mark the section currently in view as the active nav item.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const bgColor = scrolled
    ? theme === 'dark'
      ? 'rgba(3, 7, 18, 0.7)'
      : 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0)';

  const borderColor = scrolled
    ? theme === 'dark'
      ? 'rgba(31, 41, 55, 0.5)'
      : 'rgba(229, 231, 235, 0.5)'
    : 'transparent';

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: bgColor,
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
          boxShadow: scrolled
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            : '0 0px 0px 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          borderBottomWidth: scrolled ? '1px' : '0px',
          borderBottomColor: borderColor,
          borderBottomStyle: 'solid',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/images/plenro.png"
              alt="PLENRO Logo"
              width={904}
              height={654}
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PLENRO
            </span>
          </a>

          {/* Center – Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeSection === link.href ? 'true' : undefined}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link.href
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right – Theme toggle + Provincial Logo + hamburger */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Misamis Oriental Logo"
              width={960}
              height={984}
              className="w-8 h-8 object-contain hidden sm:block"
            />
            <ThemeToggle />
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={activeSection === link.href ? 'true' : undefined}
                  className={`py-3 text-sm font-medium transition-colors ${
                    activeSection === link.href
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
