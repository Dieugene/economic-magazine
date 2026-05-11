# TASK-001: Загруженная обложка номера на публике — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** На публичных страницах журнала (главная sidebar «СВЕЖИЙ НОМЕР», `/archive/{year}/` сетка обложек, `/archive/{year}/{N}/` sidebar «ЭТОТ НОМЕР») использовать `IssueSummary.cover_file` для рендера `<img>`; если поле пустое — текущая алгоритмическая SVG-обложка как фолбэк.

**Architecture:** Компонент `JournalCover` уже умеет рендерить `<img>` через optional prop `cover_url` (см. `JournalCover.tsx:21-31`). Баг — в трёх call sites, которые этот prop не передают. Правка: прокинуть `cover_url={issue.cover_file}` в трёх местах + расширить локальный тип `LatestIssue` в `HomeContent.tsx` + дополнить page-loader на `/` чтобы он включал `cover_file` в передаваемый объект. Mock-данные (`mock/data.ts`) ссылаются на несуществующие файлы в `public/covers/` — заменить на `null`, чтобы dev-mock-режим продолжал рендерить SVG-фолбэк.

**Tech Stack:** TypeScript 5, React 19, Next.js 16. Без новых зависимостей. Без тест-фреймворка (его нет в проекте). Верификация — `tsc --noEmit` + `next build` + ручной smoke в браузере (минимум — главная page).

---

## File Structure

**Modify:**
- `02_src/vte-frontend/src/components/public/HomeContent.tsx` — расширить локальный тип `LatestIssue` полем `cover_file`, передать `cover_url` в `JournalCover`.
- `02_src/vte-frontend/src/app/(public)/page.tsx` — включить `cover_file` в передаваемый в `HomeContent` объект.
- `02_src/vte-frontend/src/app/(public)/archive/[year]/YearView.tsx` — передать `cover_url={issue.cover_file}` в `JournalCover`.
- `02_src/vte-frontend/src/app/(public)/archive/[year]/[issue]/IssueView.tsx` — передать `cover_url={data.cover_file}` в `JournalCover`.
- `02_src/vte-frontend/src/lib/api/mock/data.ts` — заменить пять `cover_file: '/covers/...'` на `cover_file: null` (файлов в `public/covers/` нет, иначе в dev-mock-режиме будет broken-image).

**Не трогаем:**
- `JournalCover.tsx` — компонент уже корректен.
- `IssueSummary` / `IssueFull` в `lib/types/index.ts` — поле `cover_file` уже есть.
- Админ-страницу `/control/issues/{id}/` — там обложка отображается ссылкой «Текущий файл», работает.
- Sidebar `/archive/{year}/{N}/` блок «РУБРИКИ НОМЕРА», breadcrumbs, заголовки — вне scope.

---

## Task 1: Прокинуть cover_url в трёх call sites + расширить LatestIssue + поправить mock-данные

**Files:**
- Modify: `02_src/vte-frontend/src/components/public/HomeContent.tsx:16-21, 255-260`
- Modify: `02_src/vte-frontend/src/app/(public)/page.tsx:13-23`
- Modify: `02_src/vte-frontend/src/app/(public)/archive/[year]/YearView.tsx:48-52`
- Modify: `02_src/vte-frontend/src/app/(public)/archive/[year]/[issue]/IssueView.tsx:202`
- Modify: `02_src/vte-frontend/src/lib/api/mock/data.ts:269, 276, 283, 290, 297`

- [ ] **Step 1: Расширить тип `LatestIssue` в `HomeContent.tsx`**

Открыть `02_src/vte-frontend/src/components/public/HomeContent.tsx`. Найти блок (строки 16-21):

```typescript
interface LatestIssue {
  year: number;
  number: number;
  sequential_number: number;
  published_date: string | null;
}
```

Заменить на:

```typescript
interface LatestIssue {
  year: number;
  number: number;
  sequential_number: number;
  published_date: string | null;
  cover_file: string | null;
}
```

- [ ] **Step 2: Передать `cover_url` в `JournalCover` на главной**

В том же файле найти блок `<JournalCover>` (строки 255-260):

```tsx
                <JournalCover
                  number={latestIssue.number}
                  year={latestIssue.year}
                  sequential_number={latestIssue.sequential_number}
                  className="mb-4 group-hover:shadow-lg transition-shadow"
                />
```

Добавить prop `cover_url` между `sequential_number` и `className`:

```tsx
                <JournalCover
                  number={latestIssue.number}
                  year={latestIssue.year}
                  sequential_number={latestIssue.sequential_number}
                  cover_url={latestIssue.cover_file}
                  className="mb-4 group-hover:shadow-lg transition-shadow"
                />
```

- [ ] **Step 3: Включить `cover_file` в передаваемый объект на странице `/`**

Открыть `02_src/vte-frontend/src/app/(public)/page.tsx`. Заменить (строки 14-23):

```tsx
    <HomeContent
      latestIssue={
        latestIssue
          ? {
              year: latestIssue.year,
              number: latestIssue.number,
              sequential_number: latestIssue.sequential_number,
              published_date: latestIssue.published_date,
            }
          : null
      }
    />
```

на:

```tsx
    <HomeContent
      latestIssue={
        latestIssue
          ? {
              year: latestIssue.year,
              number: latestIssue.number,
              sequential_number: latestIssue.sequential_number,
              published_date: latestIssue.published_date,
              cover_file: latestIssue.cover_file,
            }
          : null
      }
    />
```

- [ ] **Step 4: Передать `cover_url` в `JournalCover` на странице года**

Открыть `02_src/vte-frontend/src/app/(public)/archive/[year]/YearView.tsx`. Заменить блок (строки 48-52):

```tsx
              <JournalCover
                number={issue.number}
                year={issue.year}
                className="transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
              />
```

на:

```tsx
              <JournalCover
                number={issue.number}
                year={issue.year}
                cover_url={issue.cover_file}
                className="transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
              />
```

- [ ] **Step 5: Передать `cover_url` в `JournalCover` на странице выпуска**

Открыть `02_src/vte-frontend/src/app/(public)/archive/[year]/[issue]/IssueView.tsx`. Заменить строку 202:

```tsx
                <JournalCover number={data.number} year={data.year} className="mb-4" />
```

на:

```tsx
                <JournalCover number={data.number} year={data.year} cover_url={data.cover_file} className="mb-4" />
```

- [ ] **Step 6: Поправить mock-данные**

Открыть `02_src/vte-frontend/src/lib/api/mock/data.ts`. В блоках `issueSummary1` … `issueSummary5` (строки ~266-300) найти пять полей:

```typescript
  cover_file: '/covers/vte_2026_1.jpg',
  cover_file: '/covers/vte_2025_4.jpg',
  cover_file: '/covers/vte_2025_3.jpg',
  cover_file: '/covers/vte_2025_2.jpg',
  cover_file: '/covers/vte_2025_1.jpg',
```

Заменить каждое на:

```typescript
  cover_file: null,
```

Причина: `public/covers/` в репозитории отсутствует — после правки call sites в dev-mock-режиме без файлов был бы broken-image. `null` оставляет алгоритмическую SVG-обложку — то, что dev видит сейчас.

- [ ] **Step 7: Typecheck**

```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx tsc --noEmit
```
Ожидание: проходит без ошибок.

- [ ] **Step 8: Build smoke-check**

```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx next build
```
Ожидание: сборка проходит. Warnings про `<img>` от Next (про предпочтение `<Image>`) допустимы — это сознательное решение проекта (`JournalCover` использует обычный `<img>`).

- [ ] **Step 9: Verify-grep — все три call sites теперь передают `cover_url`**

```
cd D:/_workspace/economic-magazine
git grep -n "JournalCover" 02_src/vte-frontend/src/components/public/HomeContent.tsx 02_src/vte-frontend/src/app/'(public)'/archive/'[year]'/YearView.tsx 02_src/vte-frontend/src/app/'(public)'/archive/'[year]'/'[issue]'/IssueView.tsx
```

Ожидание: для каждого файла видна строка `<JournalCover` И в окружении (`-A 5`) есть `cover_url=`. Можно прогнать с контекстом:

```
git grep -n -A 5 "<JournalCover" 02_src/vte-frontend/src/components/public/ 02_src/vte-frontend/src/app/'(public)'/
```

- [ ] **Step 10: Commit**

```bash
cd /d/_workspace/economic-magazine
git add 02_src/vte-frontend/src/components/public/HomeContent.tsx \
        02_src/vte-frontend/src/app/'(public)'/page.tsx \
        02_src/vte-frontend/src/app/'(public)'/archive/'[year]'/YearView.tsx \
        02_src/vte-frontend/src/app/'(public)'/archive/'[year]'/'[issue]'/IssueView.tsx \
        02_src/vte-frontend/src/lib/api/mock/data.ts \
        00_docs/superpowers/plans/2026-05-11-task-001-issue-cover-public.md

git commit -m "$(cat <<'EOF'
fix(public): render uploaded issue cover_file on public pages

JournalCover already supported an optional cover_url prop, but three
public call sites — the home sidebar "Latest issue", the year archive
grid, and the issue page sidebar "This issue" — never forwarded
cover_file from the API to it, so uploaded covers stayed invisible
while the algorithmic SVG was rendered for every issue.

- HomeContent: extend LatestIssue with cover_file, forward to JournalCover.
- HomePage loader: include cover_file in the latestIssue payload.
- YearView, IssueView: forward issue.cover_file as cover_url.
- Mock data: switch /covers/*.jpg placeholders (no such files in repo) to
  null so the SVG fallback still works under NEXT_PUBLIC_API_MODE=mock.

Closes TASK-001.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**1. Spec coverage (vs AC from TASK-001 payload):**
- AC «`/archive/2026/92/` sidebar содержит `<img>` с непустым `src`»: Step 5 прокидывает `cover_url={data.cover_file}` → `JournalCover` рендерит `<img>`. ✓
- AC «`/archive/2026/91/` sidebar содержит `<img>` с `src=...qa-cover-alt.png`»: то же место. ✓
- AC «главная sidebar «СВЕЖИЙ НОМЕР» использует cover_file последнего Published»: Steps 1-3 расширяют тип, page-loader и проп. ✓
- AC «у issue#3/#12 (cover_file=null) фолбэк-SVG продолжает работать, никаких broken-image»: `JournalCover.tsx:21` проверяет `if (cover_url)` truthy — `null` идёт в else-ветку (SVG). ✓
- AC «осмысленный alt»: `JournalCover.tsx:25-27` уже задаёт локализованный alt (`ВТЭ {year}, № {number}` / `IET {year}, No. {number}`). ✓
- AC «remotePatterns / `<img>` без оптимизации»: `JournalCover.tsx:24` — обычный `<img>`, `remotePatterns` не нужны. ✓

**2. Placeholder scan:** TODO / TBD / «handle edge cases» отсутствуют. Каждый шаг с конкретным кодом или командой.

**3. Type consistency:**
- `cover_url?: string | null` (`JournalCover.tsx:9`) совместимо с `IssueSummary.cover_file: string | null` и `LatestIssue.cover_file: string | null`. ✓
- `IssueFull extends IssueSummary` → `data.cover_file` существует на тип-уровне. ✓
- Mock-данные: `cover_file: null` совместимо с `string | null`. ✓

---

## Notes

- Возможный warning на build от Next 16 про `<img>` (рекомендация использовать `<Image>`). Сознательное решение проекта: ничего не меняем.
- На staging бэк отдаёт `cover_file` как `http://backend:8000/media/...`. `INTERNAL_ORIGIN strip` в `client.ts:30-49` срезает префикс до `/media/...`. На публике картинка резолвится против page origin — корректно.
- Smoke в браузере (опционально, не в этом плане): открыть `http://localhost:3000/` в mock-режиме (`NEXT_PUBLIC_API_MODE=mock`) — sidebar должен показать SVG-фолбэк (т.к. mock теперь null). На staging проверка — задача QA через TASK-001-reply.
