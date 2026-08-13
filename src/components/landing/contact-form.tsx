'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Tag,
  MessageSquare,
} from 'lucide-react';

// Must mirror the limits enforced server-side in functions/lib/contact.mjs.
const FIELD_LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 2000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = 'name' | 'email' | 'subject' | 'message';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot — must stay empty for real users
};

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
};

const inputClass = (hasError: boolean) =>
  [
    'w-full rounded-xl px-4 py-3 text-sm transition-colors',
    'bg-white dark:bg-gray-800/60',
    'text-gray-900 dark:text-white',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50',
    hasError
      ? 'border border-red-400 dark:border-red-500/70'
      : 'border border-gray-200 dark:border-gray-700',
  ].join(' ');

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const handleChange =
    (field: FieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (status === 'error' || status === 'success') {
        setStatus('idle');
      }
    };

  const validate = (): boolean => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your full name.';
    if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (form.message.trim().length < 10) {
      next.message = 'Please enter a message of at least 10 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setServerError('');

    // Honeypot filled → silently "succeed" so bots learn nothing.
    if (form.website.trim()) {
      setStatus('success');
      return;
    }

    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          website: form.website,
        }),
      });

      let data: { error?: string; errors?: string[] } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON body — keep data empty.
      }

      if (!res.ok) {
        const message =
          data.error ||
          (data.errors && data.errors[0]) ||
          `Request failed with status ${res.status}.`;
        throw new Error(message);
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error(err);
      setServerError(
        err instanceof Error
          ? err.message
          : 'Failed to send your message. Please try again later.'
      );
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="rounded-2xl p-6 md:p-8 bg-white dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Send className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Send Us a Message
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            We usually respond within 1–2 working days.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-5">
        {/* Honeypot — hidden from humans, bots fill it in */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
            >
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Full Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Juan Dela Cruz"
              maxLength={FIELD_LIMITS.name}
              value={form.name}
              onChange={handleChange('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={inputClass(Boolean(errors.name))}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
            >
              <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={FIELD_LIMITS.email}
              value={form.email}
              onChange={handleChange('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={inputClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="contact-subject"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            <Tag className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            placeholder="e.g. Quarry permit application inquiry"
            maxLength={FIELD_LIMITS.subject}
            value={form.subject}
            onChange={handleChange('subject')}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className={inputClass(Boolean(errors.subject))}
          />
          {errors.subject && (
            <p id="contact-subject-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="How can we help you?"
            maxLength={FIELD_LIMITS.message}
            value={form.message}
            onChange={handleChange('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`${inputClass(Boolean(errors.message))} resize-y min-h-[120px]`}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.message ? (
              <p id="contact-message-error" className="text-xs text-red-500 dark:text-red-400 font-medium">
                {errors.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
              {form.message.length}/{FIELD_LIMITS.message}
            </span>
          </div>
        </div>

        {/* Status / Submit */}
        <div aria-live="polite">
          {status === 'success' && (
            <div className="flex items-start gap-2.5 rounded-xl p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Thank you! Your message has been sent. Our office will get back
                to you at your email address.
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-2.5 rounded-xl p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-600 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 disabled:opacity-70 text-white font-semibold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
