"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { IssueSummary, IssueStatus } from "@/lib/types";
import { issueSummary } from "@/lib/api/mock/data";

// Additional mock issues for a richer table
const mockIssues: IssueSummary[] = [
  issueSummary,
  {
    id: 2,
    year: 2025,
    number: 4,
    sequential_number: 29,
    published_date: "2025-11-15",
    cover_url: "/covers/vte_2025_4.jpg",
    full_pdf_url: null,
    status: "published",
    article_count: 10,
  },
  {
    id: 3,
    year: 2025,
    number: 3,
    sequential_number: 28,
    published_date: "2025-08-20",
    cover_url: null,
    full_pdf_url: null,
    status: "published",
    article_count: 11,
  },
  {
    id: 4,
    year: 2026,
    number: 2,
    sequential_number: 31,
    published_date: "",
    cover_url: null,
    full_pdf_url: null,
    status: "ready",
    article_count: 9,
  },
  {
    id: 5,
    year: 2026,
    number: 3,
    sequential_number: 32,
    published_date: "",
    cover_url: null,
    full_pdf_url: null,
    status: "draft",
    article_count: 4,
  },
];

const statusLabels: Record<IssueStatus, string> = {
  draft: "Черновик",
  ready: "Готов",
  published: "Опубликован",
};

const statusColors: Record<IssueStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  ready: "bg-copper-50 text-copper-600",
  published: "bg-green-50 text-green-700",
};

const availableYears = [...new Set(mockIssues.map((i) => i.year))].sort(
  (a, b) => b - a
);

export default function IssuesPage() {
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");

  const filtered = useMemo(() => {
    return mockIssues.filter((issue) => {
      if (yearFilter !== "all" && issue.year !== yearFilter) return false;
      if (statusFilter !== "all" && issue.status !== statusFilter) return false;
      return true;
    });
  }, [yearFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Управление номерами
        </h1>
        <button className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors">
          <Plus className="w-4 h-4" />
          Создать номер
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="field-label" htmlFor="year-filter">
              Год
            </label>
            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            >
              <option value="all">Все годы</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="status-filter">
              Статус
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as IssueStatus | "all")
              }
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            >
              <option value="all">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="ready">Готов</option>
              <option value="published">Опубликован</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Год
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Номер
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Сквозной №
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Дата выхода
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Статус
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Статей
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue) => (
              <tr
                key={issue.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-800">{issue.year}</td>
                <td className="px-4 py-3 text-gray-800">№ {issue.number}</td>
                <td className="px-4 py-3 text-gray-500">
                  {issue.sequential_number}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {issue.published_date || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${statusColors[issue.status]}`}
                  >
                    {statusLabels[issue.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {issue.article_count}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/issues/${issue.id}`}
                    className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Номера не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
