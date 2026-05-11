# TASK-001: Bug-A — Загруженная обложка номера не отображается на публике

**От:** qa
**Кому:** dev
**Дата:** 2026-05-11
**Связанные задачи:** —
**Файлы кода (вероятные точки):** `02_src/vte-frontend/src/components/public/IssueCard.tsx`, `02_src/vte-frontend/src/components/public/IssueCover.tsx` (имена ориентировочные; искать там, где рендерится алгоритмическая SVG-«обложка»: «В О П Р О С Ы / теоретической / экономики / № N / YYYY»).
**Severity:** S2 (серьёзный — функция декларирована, конечный результат пользователю недоступен).
**Статус по истории:** обнаружен 2026-05-10 в `00_docs/qa/sessions/2026-05-10-staging-v0.1.11.md` (Bug-A); регрессия подтверждена 2026-05-11 в `00_docs/qa/sessions/2026-05-11-staging-v0.1.11-strict.md` (две независимые строки: «Bug-A repro» и «Bug-A repro #2»).

## Контекст

В админ-панели редактор загружает обложку выпуска через форму `/control/issues/{id}/` → блок «ОБЛОЖКА» → кнопка «Выбрать изображение JPG, PNG». Бэк сохраняет файл, и при `GET /api/issues/{id}/` возвращает заполненное поле:

```json
{
  "id": 4,
  "cover_file": "http://backend:8000/media/issues/covers_imgs/4/qa-cover-alt.png",
  ...
}
```

На фронте `INTERNAL_ORIGIN strip` срезает `http://backend:8000` до относительного пути `/media/issues/covers_imgs/4/qa-cover-alt.png` (см. `src/lib/api/client.ts:30-49`). Этот URL доступен из браузера через nginx-прокси на staging.

**Однако** на публичной части обложка не появляется ни на одной странице, где должна:

- Главная `/` — sidebar «СВЕЖИЙ НОМЕР».
- Страница года `/archive/{year}/`.
- Страница выпуска `/archive/{year}/{N}/` — sidebar «ЭТОТ НОМЕР».

Вместо реального `<img>` рисуется алгоритмическая SVG-«заглушка» с текстом «В О П Р О С Ы / теоретической / экономики / № N / YYYY». Эта же SVG корректно показывается для выпусков с `cover_file=null` (как фолбэк).

## Жёсткое доказательство (QA-сессия 2026-05-11)

Воспроизведено три раза в одной сессии:

1. На `http://185.180.230.243/` (главная, sidebar = issue#5 c загруженной cover.jpg):
   - `document.images.length === 0` (ноль `<img>` элементов), 8 `<svg>`.
   - Поиск `/covers_imgs\/5\/cover\.jpg/` и `/VTE-cover-2026-1_page-0001\.jpg/` в `document.documentElement.innerHTML` → `false` для обоих, хотя в API оба `cover_file` присутствуют.

2. На `http://185.180.230.243/archive/2026/91/` сразу после загрузки `qa-cover-alt.png` на issue#4 (admin показал toast «Обложка загружена», API подтвердил):
   - `document.images.length === 0`, 12 `<svg>`.
   - Поиск `/qa-cover-alt\.png/` в innerHTML → **true** (значение присутствует в RSC payload / data-атрибутах), но `<img>` элемента нет.
   - Поиск `/covers_imgs\/4\//` → **true**, но в виде data, не как ресурс картинки.

**Вывод:** фронт получает `cover_file` с бэка, но не рендерит `<img>` (или `background-image`) с этим URL. Это либо упущенный код, либо условный рендер, который никогда не активируется.

## Запрос / Постановка

В компонентах публичной части, где сейчас отрисовывается алгоритмическая SVG-«заглушка», добавить ветку:

- Если `issue.cover_file` непустой — отрисовать реальную картинку (`<img src={resolvedUrl} alt="..." />` или `<Image>` из `next/image`, по выбору архитектуры) с теми же визуальными размерами/пропорциями, что сейчас занимает SVG.
- Если `cover_file=null` — оставить текущую алгоритмическую SVG как фолбэк (полезно для черновиков и выпусков без обложки).

Места рендера, которые проверить (по результату snapshot'ов сессии 2026-05-11):

1. Главная `/` — sidebar «СВЕЖИЙ НОМЕР» (последний Published issue).
2. Страница года `/archive/{year}/` — карточка каждого выпуска в листе.
3. Страница выпуска `/archive/{year}/{N}/` — sidebar «ЭТОТ НОМЕР».

В админке (`/control/issues/{id}/`) текущее отображение оставить как есть — там уже показана ссылка «Текущий файл: …» в блоке «ОБЛОЖКА», работает корректно.

## Acceptance / Критерии готовности

- [ ] На `http://185.180.230.243/archive/2026/92/` после фикса sidebar «ЭТОТ НОМЕР» содержит `<img>` с непустым `src` (issue#5 имеет `cover_file = .../covers_imgs/5/cover.jpg`).
- [ ] На `http://185.180.230.243/archive/2026/91/` sidebar «ЭТОТ НОМЕР» содержит `<img>` с `src=...qa-cover-alt.png` (issue#4 — обложка загружена 2026-05-11).
- [ ] На главной `/` sidebar «СВЕЖИЙ НОМЕР» использует cover_file последнего Published (issue#5) — `<img>` элемент присутствует, картинка загружается с 200.
- [ ] На `/archive/2026/` для issue#3 (cover_file=null) и issue#12 (cover_file=null) фолбэк-SVG продолжает работать; никаких broken-image иконок.
- [ ] `alt` у картинки осмысленный: «Обложка выпуска № N / YYYY» или эквивалент.
- [ ] Если используется `<Image>` из `next/image` — `remotePatterns` в `next.config` должен содержать домен staging/prod, либо `<img>` без оптимизации (это решение разработчика).

## Доп. материалы

- Отчёт QA-сессии: `00_docs/qa/sessions/2026-05-11-staging-v0.1.11-strict.md` — строки Coverage Log `Bug-A repro` и `Bug-A repro #2`, плюс раздел «Найденные баги. Bug-A».
- Прошлая регистрация: `00_docs/qa/sessions/2026-05-10-staging-v0.1.11.md` — раздел «Bug-A».
- Контракт API: `CLAUDE_CONTEXT.md` → раздел «Финальный контракт API»; поле `Issue.cover_file: string | null`.
- INTERNAL_ORIGIN strip: `02_src/vte-frontend/src/lib/api/client.ts` (комментарий `client.ts:30-49`).
- Артефакт обложки для повторного use в reverify: `00_docs/qa/fixtures/images/qa-cover-alt.png` (1200×1600 PNG).

## После фикса

Создать обратный TaskCreate с `owner='qa'`, `metadata.from='dev'`, `metadata.to='qa'`, `metadata.related_tasks=['TASK-001']`, payload `.inbox/economic-magazine-pool/TASK-001-reply.md` — кратко: коммит/ветка, что починилось, что проверять. QA сделает focused reverify по Acceptance.
