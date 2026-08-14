'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import SectionHeading from './section-heading';

type Chunk = { source: string; text: string };

const KNOWLEDGE_FILES: { path: string; label: string }[] = [
  { path: '/knowledge/ordinances.txt', label: 'Ordinance No. 1571-2022' },
  { path: '/knowledge/republic act 7942 chapter 8.txt', label: 'RA 7942 Chapter 8' },
];

const STOPWORDS = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or the to was what when where which who will with you your please can could should would may might do does did not no we our us they them this that these those their there here'.split(' ')
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOPWORDS.has(word) && word.length > 1);
}

function splitIntoChunks(text: string, source: string): Chunk[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 30)
    .map((block) => ({ source, text: block }));
}

function escapeHtml(text: string): string {
  const entities: Record<string, string> = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' };
  return text.replace(/[&<>"]/g, (ch) => '&' + entities[ch] + ';');
}

function highlight(text: string, terms: string[]): string {
  if (terms.length === 0) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text.replace(pattern, '<mark>$1</mark>');
}

export default function RegulationSearch() {
  const [query, setQuery] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const loadChunks = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoading(true);
    const all: Chunk[] = [];
    for (const file of KNOWLEDGE_FILES) {
      try {
        const res = await fetch(file.path);
        if (!res.ok) continue;
        const text = await res.text();
        all.push(...splitIntoChunks(text, file.label));
      } catch {
        // ignore missing knowledge files
      }
    }
    setChunks(all);
    setLoading(false);
  }, []);

  const { terms, results } = useMemo(() => {
    const currentTerms = tokenize(query);
    if (!query.trim() || currentTerms.length === 0) {
      return { terms: currentTerms, results: [] as { chunk: Chunk; score: number }[] };
    }
    const scored = chunks
      .map((chunk) => {
        const lower = chunk.text.toLowerCase();
        let score = 0;
        for (const term of currentTerms) {
          if (lower.includes(term)) score += 1;
        }
        return { chunk, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return { terms: currentTerms, results: scored };
  }, [query, chunks]);

  return (
    <section id="search" className="py-24 px-6 bg-white dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Search Ordinances & Regulations"
          subtitle="Find sections of the provincial ordinance and RA 7942 by keyword."
        />

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={loadChunks}
            placeholder="e.g. quarry permit, sand and gravel tax, penalties"
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {loading && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading knowledge base…</p>
        )}

        {!loading && query.trim() && terms.length > 0 && results.length === 0 && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No matching sections found. Try different keywords.
          </p>
        )}

        {results.length > 0 && (
          <ul className="mt-6 space-y-4">
            {results.map(({ chunk }, index) => {
              const snippet =
                chunk.text.length > 320 ? `${chunk.text.slice(0, 320)}…` : chunk.text;
              return (
                <li
                  key={`${chunk.source}-${index}`}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <FileText className="w-4 h-4" />
                    {chunk.source}
                  </div>
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    // Snippet text comes from trusted static knowledge files; it is
                    // HTML-escaped first, then only query terms are wrapped in <mark>.
                    dangerouslySetInnerHTML={{
                      __html: highlight(escapeHtml(snippet), terms),
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
