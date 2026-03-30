"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Upload, ChevronRight, Save } from "lucide-react";
import type { IssueStatus } from "@/lib/types";
import { issueFullData, allArticleSummaries } from "@/lib/api/mock/data";

const statusLabels: Record<IssueStatus, string> = {
  draft: "Черновик",
  ready: "Готов",
  published: "Опубликован",
};

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const issue = issueFullData;

  const [year, setYear] = useState(issue.year);
  const [number, setNumber] = useState(issue.number);
  const [seqNumber, setSeqNumber] = useState(issue.sequential_number);
  const [publishedDate, setPublishedDate] = useState(issue.published_date);
  const [status, setStatus] = useState<IssueStatus>(issue.status);

  // Flatten all articles from sections with order numbers
  const allArticles = issue.sections.flatMap((s) => s.articles);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link
          href="/admin/issues"
          className="hover:text-forest-600 transition-colors"
        >
          Номера
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600">
          № {issue.number} ({issue.sequential_number}) / {issue.year}
        </span>
      </nav>

      {/* Page title */}
      <h1 className="text-xl font-semibold text-gray-800">
        Редактирование номера № {issue.number} ({issue.sequential_number}) /{" "}
        {issue.year}
      </h1>

      {/* Metadata form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Данные номера
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="field-label" htmlFor="issue-year">
              Год
            </label>
            <input
              id="issue-year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-number">
              Номер в году
            </label>
            <input
              id="issue-number"
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-seq">
              Сквозной номер
            </label>
            <input
              id="issue-seq"
              type="number"
              value={seqNumber}
              onChange={(e) => setSeqNumber(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-date">
              Дата выхода
            </label>
            <input
              id="issue-date"
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-status">
              Статус
            </label>
            <select
              id="issue-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            >
              <option value="draft">{statusLabels.draft}</option>
              <option value="ready">{statusLabels.ready}</option>
              <option value="published">{statusLabels.published}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cover upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Обложка
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-forest-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Перетащите изображение сюда
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG до 5 МБ</p>
          </div>
          {issue.cover_url && (
            <p className="field-hint mt-3">
              Текущий файл: {issue.cover_url}
            </p>
          )}
        </div>

        {/* PDF upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            PDF номера
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-forest-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Перетащите PDF-файл сюда</p>
            <p className="text-xs text-gray-400 mt-1">PDF до 50 МБ</p>
          </div>
          {issue.full_pdf_url && (
            <p className="field-hint mt-3">
              Текущий файл: полный PDF загружен
            </p>
          )}
        </div>
      </div>

      {/* Articles section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Статьи номера
          </h2>
          <span className="text-xs text-gray-400">
            {allArticles.length} статей
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {allArticles.map((article, index) => (
            <div
              key={article.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              {/* Order number */}
              <span className="w-7 h-7 flex-shrink-0 bg-gray-100 rounded text-xs font-medium text-gray-500 flex items-center justify-center">
                {index + 1}
              </span>

              {/* Article info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  {article.title.ru}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  с. {article.pages}
                </p>
              </div>

              {/* Section badge */}
              <span className="flex-shrink-0 text-xs bg-stone-100 text-gray-500 px-2 py-0.5 rounded hidden sm:inline-block">
                {article.section.name.ru}
              </span>

              {/* Edit link */}
              <Link
                href={`/admin/articles/${article.id}`}
                className="flex-shrink-0 text-forest-600 hover:text-forest-700 text-xs font-medium transition-colors"
              >
                Редактировать
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-forest-700 transition-colors">
          <Save className="w-4 h-4" />
          Сохранить
        </button>
        {status === "ready" && (
          <button className="inline-flex items-center gap-2 bg-copper-400 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-copper-500 transition-colors">
            Опубликовать номер
          </button>
        )}
      </div>
    </div>
  );
}
