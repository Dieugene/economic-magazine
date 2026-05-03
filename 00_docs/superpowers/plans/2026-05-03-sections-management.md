# Sections management UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Дать редактору админки управлять рубриками: видеть и менять состав рубрик, привязанных к выпуску, и вести глобальный справочник рубрик.

**Architecture:** Sections — глобальный справочник, у каждого выпуска есть подмножество (`sections_slugs`). Auto-привязка при сохранении статьи уже реализована в форме статьи. Этот план добавляет: (1) ручное управление `sections_slugs` на форме номера; (2) экран Рубрикатора с CRUD-without-delete; (3) пункт сайдбара. Никаких новых API-методов не пишем — `adminApi.createSection / updateSection / api.getSections` уже есть.

**Tech Stack:** Next.js 16 (App Router, client components), React 19, TypeScript, Tailwind, lucide-react. Бэк: DRF на `http://185.180.230.243/api/`.

---

## File Structure

**Создать:**
- `02_src/vte-frontend/src/app/(control)/control/sections/page.tsx` — экран Рубрикатор (список + add + rename).

**Изменить:**
- `02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx` — блок «Рубрики номера» с чекбоксами и отправкой `sections_slugs` в `updateIssue`.
- `02_src/vte-frontend/src/app/(control)/layout.tsx` — добавить ссылку «Рубрикатор» в массив `sidebarLinks`.

**Не трогаем:**
- `src/lib/api/client.ts` — методы уже есть (`api.getSections`, `adminApi.createSection`, `adminApi.updateSection`, `adminApi.updateIssue` принимает `sections_slugs`).
- `src/lib/types/index.ts` — `Section`, `IssueSection`, `IssueFull` уже описаны корректно.
- Форму статьи — `ensureIssueHasSection` уже добавлен в предыдущей итерации.

**Тестовые данные на бэке (НЕ удалять):** Issue id=7 и Article id=10 — живой репро для всего флоу.

---

## Task 1: Блок «Рубрики номера» на форме выпуска

**Files:**
- Modify: `02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx`

Расширяем форму выпуска: загружаем глобальный список рубрик, показываем чекбоксы. Чекнутые = `sections_slugs` выпуска. Сохраняются вместе с year/number/seq по кнопке «Сохранить данные».

- [ ] **Step 1: Добавить состояние и загрузку рубрик**

В `02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx` после существующего блока useState (после `const [pdfBusy, setPdfBusy] = useState(false);`, около строки 40) добавить:

```tsx
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
```

Импорт `Section` и `api` уже добавлен в шапке файла. Если нет — должен быть:

```tsx
import type { IssueFull, IssueStatus, Article, Section } from "@/lib/types";
import { adminApi, api, ApiError } from "@/lib/api/client";
```

В функции `loadAll` после `setIssue(data); setYear(data.year); setNumber(data.number); setSeqNumber(data.sequential_number);` добавить:

```tsx
      setSelectedSlugs(data.sections?.map((s) => s.slug) ?? []);
```

В `useEffect` (тот, где `loadAll`) после вызова `loadAll()` добавить отдельный `useEffect` для загрузки справочника:

```tsx
  useEffect(() => {
    api.getSections().then(setAllSections).catch(() => setAllSections([]));
  }, []);
```

- [ ] **Step 2: Передавать sections_slugs в handleSave**

Заменить тело `handleSave`:

```tsx
  async function handleSave() {
    if (!issue) return;
    setSaveBusy(true);
    setSaveError("");
    try {
      await adminApi.updateIssue(issueId, {
        year,
        number,
        sequential_number: seqNumber,
        sections_slugs: selectedSlugs,
      });
      await loadAll();
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Ошибка сохранения");
    } finally {
      setSaveBusy(false);
    }
  }
```

- [ ] **Step 3: Добавить UI-блок «Рубрики номера»**

Сразу после блока «Управление статусом» (после `</div>` который закрывает блок c кнопками "В черновик / Пометить готовым / Опубликовать", около строки 308) и перед началом блока с обложкой (`<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`) вставить:

```tsx
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Рубрики номера
        </h2>
        {allSections.length === 0 ? (
          <p className="text-sm text-gray-500">
            Справочник рубрик пуст. Добавьте рубрики на странице{" "}
            <Link href="/control/sections" className="text-forest-600 hover:underline">
              Рубрикатор
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-2">
            {allSections.map((s) => {
              const checked = selectedSlugs.includes(s.slug);
              return (
                <label
                  key={s.slug}
                  className="flex items-start gap-3 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedSlugs((prev) =>
                        e.target.checked
                          ? [...prev, s.slug]
                          : prev.filter((x) => x !== s.slug)
                      );
                    }}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="text-gray-800">{s.name.ru}</span>
                    <span className="text-gray-400 ml-2 text-xs">{s.slug}</span>
                  </span>
                </label>
              );
            })}
            <p className="text-xs text-gray-500 mt-3">
              Сохраняется вместе с данными номера по кнопке «Сохранить данные» выше.
            </p>
          </div>
        )}
      </div>
```

- [ ] **Step 4: Typecheck**

Run: `cd 02_src/vte-frontend && npx tsc --noEmit`
Expected: пустой вывод (без ошибок).

- [ ] **Step 5: Ручная проверка в браузере**

Откройте `http://localhost:3000/control/issues/7/`. Должен появиться блок «Рубрики номера» с чекбоксами всех рубрик из бэка. У issue 7 уже привязана `ekonomicheskaja-teorija` — она должна быть отмечена. Снимите все галки → «Сохранить данные» → перезагрузите → ни одна не отмечена. Поставьте `ekonomicheskaja-teorija` → «Сохранить» → перезагрузите → отмечена.

- [ ] **Step 6: Commit**

```bash
git add "02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx"
git commit -m "Issue form: manage sections_slugs via checkboxes"
```

---

## Task 2: Экран Рубрикатор `/control/sections/`

**Files:**
- Create: `02_src/vte-frontend/src/app/(control)/control/sections/page.tsx`

Список + кнопка «Добавить» (модалка с двумя полями ru/en) + inline-rename (двойной клик / иконка карандаша). Без удаления.

- [ ] **Step 1: Создать файл с client-component скелетом**

Создать `02_src/vte-frontend/src/app/(control)/control/sections/page.tsx`:

```tsx
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
      <DocumentTitle title="Рубрикатор" />
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
  const [en, setEn] = useState(section.name.en);
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
```

- [ ] **Step 2: Typecheck**

Run: `cd 02_src/vte-frontend && npx tsc --noEmit`
Expected: пустой вывод.

- [ ] **Step 3: Ручная проверка в браузере**

Откройте `http://localhost:3000/control/sections/`. Должен показаться список существующих рубрик (минимум 7 штук). Кликните «Добавить рубрику» → введите ru="Тест-рубрика 2026-05-03", en="Test section 2026-05-03" → «Создать» → новая строка появляется в таблице. Кликните карандаш на этой же строке, поменяйте en → ✓ → название в колонке EN обновилось. Удаление не реализовано — отдельной кнопки нет. **Тестовую рубрику не удаляйте — её удаление в этой задаче не реализовано вообще.**

- [ ] **Step 4: Commit**

```bash
git add "02_src/vte-frontend/src/app/(control)/control/sections/page.tsx"
git commit -m "Add /control/sections/ page (list + create + rename)"
```

---

## Task 3: Пункт «Рубрикатор» в сайдбаре

**Files:**
- Modify: `02_src/vte-frontend/src/app/(control)/layout.tsx`

- [ ] **Step 1: Добавить ссылку и иконку**

В `02_src/vte-frontend/src/app/(control)/layout.tsx` заменить импорт иконок:

```tsx
import { Archive, Menu, Eye, LogOut, BookOpen } from "lucide-react";
```

И заменить массив `sidebarLinks`:

```tsx
const sidebarLinks = [
  { key: "issues", label: "Номера", href: "/control/issues", icon: Archive },
  { key: "sections", label: "Рубрикатор", href: "/control/sections", icon: BookOpen },
];
```

- [ ] **Step 2: Typecheck**

Run: `cd 02_src/vte-frontend && npx tsc --noEmit`
Expected: пустой вывод.

- [ ] **Step 3: Ручная проверка**

Откройте `http://localhost:3000/control/issues/`. В сайдбаре должны быть два пункта: «Номера» и «Рубрикатор». Клик по «Рубрикатор» ведёт на `/control/sections/` и подсвечивается активным. Клик по «Номера» — обратно.

- [ ] **Step 4: Commit**

```bash
git add "02_src/vte-frontend/src/app/(control)/layout.tsx"
git commit -m "Sidebar: add 'Рубрикатор' link"
```

---

## Task 4: E2E проверка флоу sections

**Files:** только проверка через браузер. Кода не меняем.

- [ ] **Step 1: Создать рубрику через Рубрикатор (если ещё не создана в Task 2)**

Открыть `/control/sections/`, добавить тестовую рубрику ru="Sections E2E 2026-05-03", en="Sections E2E 2026-05-03". Если уже создана — пропустить.

- [ ] **Step 2: Выпуск 7 — проверить, что новая рубрика видна в чекбоксах**

Открыть `/control/issues/7/`. В блоке «Рубрики номера» должна быть строка с новой рубрикой и неотмеченным чекбоксом. `ekonomicheskaja-teorija` уже отмечена (привязка осталась с прошлого теста).

- [ ] **Step 3: Создать вторую тестовую статью в issue 7 в новой рубрике (auto-привязка)**

Перейти на `/control/articles/new/?issue_id=7`. Заполнить минимально валидную статью, в селекте «Рубрика» выбрать новую тестовую рубрику. Нажать «Создать статью». Затем вернуться в `/control/issues/7/` — в блоке «Рубрики номера» должна быть отмечена и `ekonomicheskaja-teorija`, и новая (auto-PATCH сработал в `ensureIssueHasSection`).

- [ ] **Step 4: Public-страница**

Открыть `http://localhost:3000/archive/2026/1/`. Счётчик «Статей» — 2. В содержимом видно две рубрики (одна с одной статьёй, вторая со второй).

- [ ] **Step 5: Ручное снятие рубрики на форме номера**

В `/control/issues/7/` снять галку с тестовой рубрики (но НЕ с `ekonomicheskaja-teorija`) → «Сохранить данные» → перезагрузить страницу. Чекбокс снят. Перейти на `/archive/2026/1/` — статьи в этой рубрике больше не показывается, статей в счётчике — 1.

- [ ] **Step 6: Cleanup частичный**

Удалить вторую тестовую статью из админки (issue 7 / статья из тестовой рубрики). **Issue 7, article 10 и тестовую рубрику оставить**. Они нужны как репро-кейс.

- [ ] **Step 7: Зафиксировать результат**

Если все шаги прошли — отметить #88 как completed в TodoWrite. Если что-то не работает — собрать снимок (URL, статус-код, тело ответа из network), создать новую таску с описанием.

---

## Self-Review

**Spec coverage:**
- (1) мульти-select на форме номера + sections_slugs → Task 1 ✓
- (2) экран Рубрикатор list+add+rename → Task 2 ✓
- (3) пункт сайдбара → Task 3 ✓
- (4) E2E проверка → Task 4 ✓

**Placeholders:** нет «TODO», нет «similar to», все шаги содержат конкретный код или конкретный URL/кнопку для проверки.

**Type consistency:**
- `Section` (импортируется из `@/lib/types`) — соответствует `{slug, name: {ru, en}}` (см. `src/lib/types/index.ts:42-45`).
- `adminApi.createSection({ ru, en })` и `adminApi.updateSection(slug, { ru, en })` — сигнатуры совпадают со спецификацией в `src/lib/api/client.ts:454,462`.
- `IssueUpdatePayload.sections_slugs?: string[]` — присутствует в `src/lib/api/client.ts:283`.
- `selectedSlugs` (string[]) и `setSelectedSlugs` — единое имя везде.
