'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionHeading from './section-heading';
import {
  permitTypes,
  registrationFeesData,
  finesData,
} from '@/lib/regulatory-data.mjs';

type FaqItem = { question: string; answer: string };

const generalFaqs: FaqItem[] = [
  {
    question: 'What is the tax rate on sand, gravel, and quarry materials?',
    answer:
      'A tax of ten percent (10%) of the fair market value per cubic meter of ordinary stones, sand, gravel, earth and other quarry resources extracted from private and public lands, or from the beds of seas, lakes, rivers, streams, creeks and other waters within the province.',
  },
  {
    question: 'Who issues quarry and sand-and-gravel permits?',
    answer:
      'Permits are issued by the Provincial Governor through the Provincial/City Mining Regulatory Board (PMRB).',
  },
  {
    question: 'How do I apply for a permit or download the forms?',
    answer:
      'Visit the Downloads section of this website (or click Downloads in the main menu) to download the application forms and checklists. You can also send an inquiry through the contact form.',
  },
];

const permitFaqs: FaqItem[] = permitTypes.map((permit) => ({
  question: `What is the ${permit.name} and how long is it valid?`,
  answer: `${permit.definition} Validity: ${permit.validity}.`,
}));

const feeFaq: FaqItem = {
  question: 'What are the vehicle and equipment registration fees?',
  answer: registrationFeesData
    .map((item) => `${item.particular} — ${item.fee}`)
    .join(' · '),
};

const fineFaq: FaqItem = {
  question: 'What are the common fines and penalties?',
  answer: finesData
    .map((item) => `${item.section} — ${item.fine}: ${item.charge}`)
    .join(' · '),
};

const faqs: FaqItem[] = [...generalFaqs, ...permitFaqs, feeFaq, fineFaq];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 bg-gray-50 dark:bg-gray-950/40">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Quick answers about permits, fees, and penalties under PLENRO regulations."
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3 font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                    <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
