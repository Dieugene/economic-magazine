'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  authors: string;
  title: string;
  href: string;
  pages: string;
  pdfSizeKb?: number | null;
  pdfUrl?: string | null;
  abstract?: string | null;
}

export default function ArticleCard({
  authors,
  title,
  href,
  pages,
  pdfSizeKb,
  pdfUrl,
  abstract,
}: ArticleCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-stone-400 rounded-sm p-5 bg-white transition-all duration-200 hover:bg-stone-50 hover:border-copper-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">{authors}</p>
          <h4 className="font-serif text-lg sm:text-xl font-semibold text-forest-700 leading-snug">
            <Link href={href} className="hover:text-copper-500 transition-colors">
              {title}
            </Link>
          </h4>
          <p className="text-sm text-gray-400 mt-2">
            С.&nbsp;{pages.replace('-', '\u2013')}
            {pdfSizeKb ? ` \u00B7 ${pdfSizeKb} КБ` : ''}
          </p>
        </div>
        {pdfUrl && (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 bg-forest-50 px-3 py-1.5 rounded-sm hover:bg-forest-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M6 20h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </a>
          </div>
        )}
      </div>
      {abstract && (
        <div className="mt-3">
          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-copper-500 hover:text-copper-600 transition-colors flex items-center gap-1"
          >
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{open ? 'Скрыть аннотацию' : 'Аннотация'}</span>
          </button>
          <div
            className="overflow-hidden transition-all duration-350"
            style={{ maxHeight: open ? '500px' : '0px' }}
          >
            <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-4 border-l-2 border-stone-400">
              {abstract}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
