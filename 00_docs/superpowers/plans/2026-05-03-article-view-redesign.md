# Article View Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Привести страницу `/article/[id]` к monolingual-логике старого сайта `questionset.ru`, сохранив текущий стилевой язык проекта (Tailwind palette `forest`/`copper`/`stone`, `font-serif` для заголовков). Один файл `src/app/(public)/article/[id]/ArticleView.tsx`. Только JSX, без правок API/типов/админки.

**Architecture:** Убрать двуязычное соседство в трёх местах: `AbstractTabs` (две вкладки), второй блок «References», дублирующий заголовок в EN-mode. Добавить недостающие блоки (License CC 4.0, Copyright). Везде, где нужного перевода нет — fallback с пометкой `(In Russian)` / `(in English)`.

**Tech Stack:** Next.js 16 client component, React 19, TypeScript, Tailwind v4, lucide-react. `useLanguage()` из `@/lib/i18n/LanguageContext` уже даёт `lang: 'ru' | 'en'` и `t(ru, en)`.

---

## File Structure

**Modify:**
- `02_src/vte-frontend/src/app/(public)/article/[id]/ArticleView.tsx` — единственный файл этого плана.

**Может удалиться (по решению имплементера):**
- `02_src/vte-frontend/src/components/public/AbstractTabs.tsx` — после удаления использования из `ArticleView` импорт перестанет существовать. Файл может быть удалён или оставлен «висеть» — не принципиально. По умолчанию **удалить**, чтобы не плодить мёртвый код.

**Не трогаем:**
- `src/lib/api/client.ts`, `src/lib/types/index.ts`, админ-формы, маршруты, layout, бэк.
- Карточки статей в `IssueView`/`SectionView`/`SearchForm` — они уже корректные (один язык по UI lang).

---

## Контракт: monolingual логика

Везде где есть LocalizedString (`title`, `abstract`, `funding`, `keywords`, `section_name`) — выбирается значение по UI lang с fallback:

```ts
function pickWithFallback(value: { ru?: string; en?: string } | null | undefined, lang: 'ru' | 'en'): { text: string; isFallback: boolean } | null {
  if (!value) return null;
  const primary = lang === 'en' ? value.en : value.ru;
  const secondary = lang === 'en' ? value.ru : value.en;
  if (primary && primary.trim()) return { text: primary, isFallback: false };
  if (secondary && secondary.trim()) return { text: secondary, isFallback: true };
  return null;
}
```

Вспомогательный label-комментарий fallback:
- `lang='ru'`, fallback показывается → `(на английском)`
- `lang='en'`, fallback показывается → `(in Russian)`

---

## Task 1: Убрать AbstractTabs, заменить monolingual блоком

**File:** `02_src/vte-frontend/src/app/(public)/article/[id]/ArticleView.tsx`

- [ ] **Step 1: Убрать import AbstractTabs**

В шапке файла удалить строку:

```tsx
import AbstractTabs from "@/components/public/AbstractTabs";
```

- [ ] **Step 2: Заменить блок с `AbstractTabs` на monolingual блок**

Найти и заменить (вокруг строк 225-234, блок `{/* Abstract (single language based on UI lang) */}` ... `{/* AbstractTabs already supports both languages internally */}`):

```tsx
          {/* Abstract */}
          {(() => {
            const abstract = pickWithFallback(article.abstract, lang);
            const keywords = lang === "en" && article.keywords?.en?.length
              ? { items: article.keywords.en, isFallback: false }
              : article.keywords?.ru?.length
                ? { items: article.keywords.ru, isFallback: lang === "en" }
                : null;
            if (!abstract && !keywords) return null;
            return (
              <div className="mb-8 bg-white border border-stone-400 rounded-sm p-6">
                <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                  {t("Аннотация", "Abstract")}
                  {abstract?.isFallback && (
                    <span className="ml-3 text-xs font-normal text-gray-500 italic">
                      {lang === "en" ? "(in Russian)" : "(на английском)"}
                    </span>
                  )}
                </h3>
                {abstract && (
                  <p className="text-[15px] text-gray-700 leading-relaxed">{abstract.text}</p>
                )}
                {keywords && (
                  <div className="mt-5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {t("Ключевые слова", "Keywords")}
                      {keywords.isFallback && (
                        <span className="ml-2 normal-case font-normal italic">
                          {lang === "en" ? "(in Russian)" : "(на английском)"}
                        </span>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.items.map((kw) => (
                        <span
                          key={kw}
                          className="inline-block text-xs bg-stone-200 text-gray-600 px-2.5 py-1 rounded-sm"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
```

- [ ] **Step 3: Добавить хелпер `pickWithFallback` в начало файла**

Добавить рядом с существующим `pickLang` (около строки 17):

```tsx
function pickWithFallback(
  value: { ru?: string; en?: string } | null | undefined,
  lang: "ru" | "en"
): { text: string; isFallback: boolean } | null {
  if (!value) return null;
  const primary = lang === "en" ? value.en : value.ru;
  const secondary = lang === "en" ? value.ru : value.en;
  if (primary && primary.trim()) return { text: primary, isFallback: false };
  if (secondary && secondary.trim()) return { text: secondary, isFallback: true };
  return null;
}
```

- [ ] **Step 4: Удалить файл AbstractTabs**

```bash
rm "02_src/vte-frontend/src/components/public/AbstractTabs.tsx"
```

(Если на нём кто-то завязан — typecheck упадёт. Проверить grep'ом: `grep -r "AbstractTabs" 02_src/vte-frontend/src/` должно дать 0 результатов после удаления импорта в ArticleView.)

---

## Task 2: Заменить два блока References на один monolingual

**File:** тот же.

- [ ] **Step 1: Заменить оба блока на один**

Найти и заменить блоки `{/* Bibliography (Russian) */}` и `{/* References (English) */}` (строки 246-268):

```tsx
          {/* References */}
          {(() => {
            const refsArr = article.references ?? [];
            const primaryKey = lang === "en" ? "en" : "ru";
            const secondaryKey = lang === "en" ? "ru" : "en";
            const primary = refsArr.map((r) => r[primaryKey]).filter(Boolean).join("\n");
            const secondary = refsArr.map((r) => r[secondaryKey]).filter(Boolean).join("\n");
            const text = primary || secondary;
            const isFallback = !primary && !!secondary;
            if (!text) return null;
            return (
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                  {t("Литература", "References")}
                  {isFallback && (
                    <span className="ml-3 text-xs font-normal text-gray-500 italic">
                      {lang === "en" ? "(in Russian)" : "(на английском)"}
                    </span>
                  )}
                </h3>
                <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{text}</p>
              </div>
            );
          })()}
```

- [ ] **Step 2: Очистить мёртвые переменные**

После замены строки `const referencesRu = ...` и `const referencesEn = ...` (около строки 36-38) больше не используются. Удалить эти две строки.

---

## Task 3: Убрать русский title.ru в EN-mode

**File:** тот же.

- [ ] **Step 1: Удалить рендер `title.ru` под основным заголовком в EN-mode**

Найти и удалить блок (строки 106-110):

```tsx
            {lang === "en" && article.title.ru && (
              <p className="font-serif text-xl text-gray-500 italic leading-snug mb-6">
                {article.title.ru}
              </p>
            )}
```

Блок для `lang === "ru" && article.title.en` (строки 101-105) **сохранить** — английский подзаголовок в RU-mode остаётся.

---

## Task 4: Добавить License Creative Commons 4.0 в downloads-sidebar

**File:** тот же.

- [ ] **Step 1: Добавить строку лицензии под кнопками PDF/XML**

В правом sidebar в карточке «Скачать» (Download), сразу после `</div>` который закрывает блок с PDF и XML кнопками, перед закрывающим `</div>` карточки (около строки 325), добавить:

```tsx
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {t("Лицензия", "License")}:{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-copper-400 transition-colors"
                >
                  Creative Commons 4.0 BY
                </a>
              </p>
```

---

## Task 5: Добавить Copyright (две строки)

**File:** тот же.

- [ ] **Step 1: Добавить блок copyright между References и Citation**

Между блоком References (изменён в Task 2) и блоком `{/* Citation block */}` (около строки 270), добавить:

```tsx
          {/* Copyright */}
          {(() => {
            const authorsCopy = (article.authors ?? [])
              .map((a) => {
                const name = pickLang(a.full_name, lang).trim();
                if (!name) return null;
                const parts = name.split(/\s+/);
                if (lang === "en") {
                  if (parts.length >= 2) {
                    const first = parts[0][0] + ".";
                    const last = parts.slice(1).join(" ");
                    return `${first} ${last}`;
                  }
                  return name;
                }
                if (parts.length >= 2) {
                  const surname = parts[0];
                  const initials = parts.slice(1).map((p) => p[0] + ".").join(" ");
                  return `${initials} ${surname}`;
                }
                return name;
              })
              .filter(Boolean)
              .join(", ");
            const journalCopy = lang === "en"
              ? "Institute of Economics of the Russian Academy of Sciences «Issues of Economic Theory»"
              : "ФГБУН Институт экономики РАН «Вопросы теоретической экономики»";
            return (
              <div className="mb-6 text-xs text-gray-500 leading-relaxed">
                {authorsCopy && <p>© {authorsCopy}, {article.issue_year}</p>}
                <p>© {journalCopy}, {article.issue_year}</p>
              </div>
            );
          })()}
```

---

## Task 6: Typecheck + commit

- [ ] **Step 1: Typecheck**

Run: `cd 02_src/vte-frontend && npx tsc --noEmit`
Expected: пустой вывод.

- [ ] **Step 2: Browser smoke check (controller-only)**

Не выполняется имплементером — только controller через chrome-devtools.

- [ ] **Step 3: Commit**

```bash
git add "02_src/vte-frontend/src/app/(public)/article/[id]/ArticleView.tsx"
# если файл AbstractTabs удалён:
git add -u "02_src/vte-frontend/src/components/public/AbstractTabs.tsx"
git commit -m "Article page: monolingual layout with old-site block composition"
```

---

## Self-Review Checklist (для имплементера)

- [ ] Двуязычного соседства на странице больше нет нигде, кроме корректного «английский подзаголовок в RU-mode».
- [ ] Везде где значения локализованы — fallback с пометкой работает (для обоих направлений).
- [ ] AbstractTabs компонент удалён или оставлен явно (без ошибок компиляции).
- [ ] Стилевые токены `forest`/`copper`/`stone`/`font-serif` сохранены, ничего нового не добавлено.
- [ ] Typecheck чистый.
- [ ] В файле один блок ссылок, один блок аннотации, один (только в RU) подзаголовок альтернативного языка.
