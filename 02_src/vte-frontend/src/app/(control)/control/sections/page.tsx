"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import { adminApi, api, ApiError } from "@/lib/api/client";
import type { Section } from "@/lib/types";
import DocumentTitle from "@/components/public/DocumentTitle";

export default function SectionsAdminPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loadError, setLoadError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function loadSections() {
    try {
      const data = await api.getSections();
      setSections(data);
      setLoadError("");
    } catch (e) {
      setLoadError(e instanceof ApiError ? e.message : "Ошибка загрузки рубрик");
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  return (
    <div className="space-y-6">
      <DocumentTitle ru="Рубрикатор" en="Sections" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Рубрикатор</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить рубрику
        </button>
      </div>

      {loadError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {loadError}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Название (RU)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title (EN)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {sections.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Рубрик пока нет
                </td>
              </tr>
            ) : (
              sections.map((s) =>
                editingSlug === s.slug ? (
                  <SectionEditRow
                    key={s.slug}
                    section={s}
                    onCancel={() => setEditingSlug(null)}
                    onSaved={() => {
                      setEditingSlug(null);
                      loadSections();
                    }}
                  />
                ) : (
                  <tr key={s.slug} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-800">{s.name.ru}</td>
                    <td className="px-4 py-3 text-gray-600">{s.name.en}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingSlug(s.slug)}
                        className="text-gray-400 hover:text-forest-600"
                        aria-label="Переименовать"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateSectionModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadSections();
          }}
        />
      )}
    </div>
  );
}

function CreateSectionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [ru, setRu] = useState("");
  const [en, setEn] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminApi.createSection({ ru, en });
      onCreated();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ошибка создания рубрики");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Новая рубрика</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (русский) *
            </label>
            <input
              autoFocus
              required
              value={ru}
              onChange={(e) => setRu(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English) *
            </label>
            <input
              required
              value={en}
              onChange={(e) => setEn(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 text-sm bg-forest-600 text-white rounded hover:bg-forest-700 disabled:opacity-50"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionEditRow({
  section,
  onCancel,
  onSaved,
}: {
  section: Section;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [ru, setRu] = useState(section.name.ru);
  const [en, setEn] = useState(section.name.en ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setBusy(true);
    setError("");
    try {
      await adminApi.updateSection(section.slug, { ru, en });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ошибка сохранения");
      setBusy(false);
    }
  }

  return (
    <tr className="border-b border-gray-100 last:border-0 bg-yellow-50/40">
      <td className="px-4 py-2">
        <input
          autoFocus
          value={ru}
          onChange={(e) => setRu(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </td>
      <td className="px-4 py-2">
        <input
          value={en}
          onChange={(e) => setEn(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </td>
      <td className="px-4 py-2 text-gray-400 font-mono text-xs">{section.slug}</td>
      <td className="px-4 py-2 text-right">
        <div className="inline-flex gap-1">
          <button
            onClick={handleSave}
            disabled={busy}
            className="text-forest-600 hover:bg-forest-50 p-1 rounded disabled:opacity-50"
            aria-label="Сохранить"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            disabled={busy}
            className="text-gray-400 hover:bg-gray-50 p-1 rounded disabled:opacity-50"
            aria-label="Отмена"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </td>
    </tr>
  );
}
