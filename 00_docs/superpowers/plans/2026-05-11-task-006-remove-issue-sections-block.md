# TASK-006: Удалить блок «РУБРИКИ НОМЕРА» из формы редактирования выпуска — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** На форме `/control/issues/{id}/` убрать блок «РУБРИКИ НОМЕРА» (H2 + 7 чекбоксов + подсказку) и связанный state/effect/payload-поле. Фронт перестаёт отправлять `sections_slugs` в PATCH/POST `/issues/`. Бэк сам подписывает все рубрики справочника на новые выпуски и оставляет существующие на PATCH (продуктовое решение из бэклога 2026-05-09 п.11).

**Architecture:** Локализованное удаление UI/state/payload в `issues/[id]/page.tsx`. Тип `IssueUpdateRequest.sections_slugs` в `client.ts` уже optional — payload без поля валиден. Защитную сетку `ensureIssueHasSection` в `articles/[id]/page.tsx` **не трогаем** — она остаётся как страховка на случай, если бэк не успел подписать новую рубрику (см. TASK-006 §4). Модалка «Создать номер» в `issues/page.tsx` секций не включает (подтверждено grep'ом — все вхождения `sections_slugs`/`selectedSlugs`/`Рубрики` только в трёх известных файлах).

**Tech Stack:** TypeScript 5, React 19, Next.js 16. Без новых зависимостей, без тест-фреймворка. Верификация — `tsc --noEmit` + `next build` + ручная проверка через grep.

---

## File Structure

**Modify:**
- `02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx` — удаление блока, state, effect, payload-поля и неиспользованных импортов.

**Не трогаем:**
- `02_src/vte-frontend/src/app/(control)/control/articles/[id]/page.tsx::ensureIssueHasSection` (строки ~324-333) — остаётся как защитная сетка.
- `02_src/vte-frontend/src/lib/api/client.ts` — типы `IssueCreateRequest.sections_slugs?` и `IssueUpdateRequest.sections_slugs?` остаются optional, других потребителей не блокируют.
- `02_src/vte-frontend/src/app/(control)/control/issues/page.tsx` (модалка «Создать номер») — секций нет, ничего удалять не нужно.

---

## Task 1: Удалить блок «Рубрики номера», связанный state и поле payload

**Files:**
- Modify: `02_src/vte-frontend/src/app/(control)/control/issues/[id]/page.tsx:18, 19, 55-56, 66, 84-86, 108-114, 384-426`

- [ ] **Step 1: Убрать поле `sections_slugs` из payload `updateIssue`**

Найти строки 108-114:
```typescript
      await adminApi.updateIssue(issueId, {
        year,
        number,
        sequential_number: seqNumber,
        sections_slugs: selectedSlugs,
        published_date: publishedDate || null,
      });
```
Заменить на:
```typescript
      await adminApi.updateIssue(issueId, {
        year,
        number,
        sequential_number: seqNumber,
        published_date: publishedDate || null,
      });
```

- [ ] **Step 2: Убрать блок «Рубрики номера» из JSX**

Найти и **удалить целиком** блок (строки 384-426 в текущем состоянии):
```tsx
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Рубрики номера
        </h2>
        {allSections.length === 0 ? (
          <p className="text-sm text-gray-500">
            Справочник рубрик пуст.
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
                    disabled={saveBusy}
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
Включая пустую строку после `</div>`.

- [ ] **Step 3: Убрать useEffect, загружающий справочник секций**

Найти и удалить блок (строки 84-86):
```typescript
  useEffect(() => {
    api.getSections().then(setAllSections).catch(() => setAllSections([]));
  }, []);
```

- [ ] **Step 4: Убрать setSelectedSlugs из `loadAll`**

В функции `loadAll` найти строку 66:
```typescript
      setSelectedSlugs(data.sections?.map((s) => s.slug) ?? []);
```
Удалить эту строку целиком (вместе с её ведущими пробелами и переводом строки).

- [ ] **Step 5: Убрать state-объявления `allSections` и `selectedSlugs`**

Найти и удалить строки 55-56:
```typescript
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
```

- [ ] **Step 6: Удалить неиспользованные импорты**

В строке 18 (импорт типов):
```typescript
import type { IssueFull, IssueStatus, IssueSummary, Article, Section } from "@/lib/types";
```
Удалить `, Section` (тип больше не используется):
```typescript
import type { IssueFull, IssueStatus, IssueSummary, Article } from "@/lib/types";
```

В строке 19 (импорт API-клиентов):
```typescript
import { adminApi, api } from "@/lib/api/client";
```
`api.getSections` больше не вызывается — проверь grep'ом, что во всём файле нет других `api.` (только `adminApi.`). Если так — оставь только `adminApi`:
```typescript
import { adminApi } from "@/lib/api/client";
```

Если есть другие `api.` (например, `api.getSections` где-то ещё) — это значит мы что-то пропустили; остановиться и сообщить.

- [ ] **Step 7: Typecheck**

```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx tsc --noEmit
```
Ожидание: clean. Если TS жалуется на неиспользуемый `Section` или `api` — значит шаг 6 не дочистил, повторить.

- [ ] **Step 8: Verify-grep (никаких остатков)**

```
cd D:/_workspace/economic-magazine
git grep -n "selectedSlugs\|setSelectedSlugs\|allSections\|setAllSections" 02_src/vte-frontend/src/app/'(control)'/control/issues/'[id]'/page.tsx
```
Ожидание: **пусто** (0 совпадений).

```
git grep -n "sections_slugs" 02_src/vte-frontend/src/app/'(control)'/control/issues/'[id]'/page.tsx
```
Ожидание: пусто (поле удалено из payload в этом файле).

```
git grep -n "Рубрики номера\|РУБРИКИ НОМЕРА" 02_src/vte-frontend/src/app/'(control)'/control/issues/'[id]'/page.tsx
```
Ожидание: пусто.

Контроль того, что мы НЕ задели `articles/[id]/page.tsx`:
```
git grep -n "ensureIssueHasSection\|sections_slugs" 02_src/vte-frontend/src/app/'(control)'/control/articles/'[id]'/page.tsx
```
Ожидание: показывает строки `ensureIssueHasSection` и `sections_slugs: [...existing, slug]` (строка ~333) — **не пусто**, защитная сетка цела.

- [ ] **Step 9: Build smoke-check**

```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx next build
```
Ожидание: компилируется, все 16 статичных страниц собраны, `/control/issues/[id]` среди динамических роутов.

- [ ] **Step 10: Commit**

```bash
cd /d/_workspace/economic-magazine
git add 02_src/vte-frontend/src/app/'(control)'/control/issues/'[id]'/page.tsx \
        00_docs/superpowers/plans/2026-05-11-task-006-remove-issue-sections-block.md

git commit -m "$(cat <<'EOF'
fix(control): drop sections checkboxes from issue edit form

Per backlog 2026-05-09 §11 and the existing "Block A" removal of the
sections admin page, sections are auto-subscribed to every issue by
the backend; manual subscribe/unsubscribe is no longer part of the UX.
The issue edit form still showed 7 checkboxes (all checked) plus a
"sections_slugs" PATCH field — confusing for editors and a foot-gun if
the form ever shrank the slug list. Drop the block, the local state,
the GET /sections/ effect, and the sections_slugs payload field.
ensureIssueHasSection in the article form stays untouched as a safety
net.

Closes TASK-006.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**1. Spec coverage (vs AC from TASK-006 payload):**
- AC «отсутствует H2 «РУБРИКИ НОМЕРА», 7 чекбоксов, подсказка»: Step 2 удаляет блок целиком. ✓
- AC «кнопка «Сохранить данные» сохраняет метаданные»: `handleSave` сохраняет `year/number/sequential_number/published_date` через PATCH — поле sections_slugs убрано, бэк примет частичный PATCH. ✓
- AC «модалка создания выпуска работает; в новой строке колонка «Рубрик» = 7»: модалка sections не отправляет (grep подтвердил), бэк сам подпишет. ✓
- AC «PATCH `/issues/{id}/` не содержит `sections_slugs`»: Step 1 удаляет поле из payload. ✓
- AC «`ensureIssueHasSection` работает прозрачно»: оставляем нетронутым; либо все 7 уже подписаны, либо страховка добьёт. ✓
- AC «переходы статусов работают»: `handleStatusChange` не трогаем. ✓
- AC «tsc + next build проходят»: Steps 7, 9. ✓

**2. Placeholder scan:** TODO/TBD/«handle edge cases» отсутствуют. Каждый шаг с конкретным кодом или командой.

**3. Type consistency:**
- `IssueUpdateRequest.sections_slugs?: string[]` (`client.ts:288`) — optional, payload без поля валиден. ✓
- После Step 6 импорт `Section` исчезает из файла; никакого `Section` в коде после удаления state не остаётся. ✓
- `api.getSections()` единственный потребитель `api` в этом файле; после удаления — импорт сокращается. ✓

---

## Notes

- `client.ts` типы `IssueCreateRequest`/`IssueUpdateRequest` оставляем с optional `sections_slugs?`. Удалять их из типа — отдельная небольшая правка контракта, и `ensureIssueHasSection` всё ещё их использует (`articles/[id]/page.tsx:333`). Делать сейчас не нужно — out of scope.
- Mock-данные (`mock/data.ts`) — структура `IssueSummary`/`IssueFull` содержит `sections`, не `sections_slugs`. Менять mock не нужно.
