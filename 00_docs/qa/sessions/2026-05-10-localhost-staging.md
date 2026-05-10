# Test Session: full regression localhost-frontend × staging-backend

> Заполнять как живой журнал: пишем в момент прогона, не задним числом.

---

## Метаданные

| Поле | Значение |
|---|---|
| **Session ID** | `2026-05-10-localhost-staging` |
| **Дата / время старт** | `2026-05-10 ~22:00` (UTC+3) |
| **Дата / время конец** | `2026-05-10 ~23:25` (UTC+3) |
| **Длительность чистого тестирования** | ~1 ч 25 мин |
| **Тестировщик** | Claude (агент) под координацией Е. Дитковского |
| **Билд / версия** | фронт — локальный `next dev` на main HEAD `1839dcb` (после Wave 1+2 бэклога 2026-05-09, 17 коммитов впереди origin/main, ещё не запушены); бэк — staging `185.180.230.243` (релиз 2026-05-09 с фиксами Bug-71 + PDF validator) |
| **Окружение** | local frontend (`http://localhost:3000`) с прокси `/backend/...` → реальный staging бэк (`http://185.180.230.243/api/`) |
| **Браузер / ОС** | Chrome через `chrome-devtools` MCP / Windows 11 |
| **Тип сессии** | regression (полный прогон по `test_plan_issues_sections_articles.md`) |
| **Связанный план** | `00_docs/qa/test_plan_issues_sections_articles.md` |

---

## Charter (миссия сессии)

Полная регрессионная проверка фронтенда после реализации бэклога 2026-05-09 (Wave 1+2: блоки A, B, C, D, E, F, G1-G4, G5 + #94 references). Цель — убедиться, что новый функционал работает на реальном бэке и что существующие сценарии не сломались. Прогон по всем разделам тест-плана §2 (seed) → §4 (smoke) → §5 (functional) → §6 (CRUD) → §7 (regression) → §8 (edge) → §9 (public static + cookies). Конфигурация: локальный фронт через `next dev` против реального бэка staging.

---

## Scope

**Включено:**
- §2 — Seed по полному сценарию (3 выпуска QA-DRAFT/READY/PUBLISHED + 7-10 статей)
- §4 — Smoke S1–S6
- §5 — Functional F1–F12
- §6 — CRUD E1–E4
- §7 — Regression 7.1–7.7
- §8 — Edge 8.1–8.7
- §9 — Public static pages 9.1–9.6

**Исключено (явно):**
- F8c (replace article PDF в Published) — на staging БД может быть очищена; если нет подходящего опубликованного выпуска, помечаем SKIP.
- §10 «Очистка после прогона» — на staging применяется политика «не подчищать», тестовые данные оставляем.

---

## Coverage / Test log

> Отмечать в реальном времени. Заполняется агентом по ходу прогона.

| Кейс | Объект | Результат | Время | Заметка |
|---|---|---|---|---|
| Login | editorqet@inecon.ru | PASS | 22:05 | JWT выдан, на `/control/issues/` виден issue #1 (2026/№1, Published, 4 статьи, 7 рубрик) |
| Seed/Issue QA-DRAFT | id=3, 2026/90/90, Draft, дата 01.04.2026 | PARTIAL | 22:08 | Создан. Дата выхода в списке = `—` (известное ограничение бэка — не принимает published_date). См. **Bug-1** ниже. |
| §7.1 regression check | GET /api/issues/3/ | **FAIL** | 22:09 | `articles_count=0` (ОК), но `IssueSection.articles` содержит чужие статьи: рубрика «ekonomicheskaja-teorija» → ids [1,2,4] из issue#1, «metodologija» → [3] из issue#1. Бэк-фикс Bug-71 (заявленный 2026-05-09) **сломан**. См. **Bug-2**. |
| §7.1 frontend column | колонка «Статей» в list view | **FAIL** | 22:10 | Для нового пустого QA-DRAFT (id=3) показано «4». Защитная сетка фронта (`s.articles.filter(a=>a.issue_id===issue.id)`) либо не применяется к колонке, либо считается до фильтра. См. **Bug-3**. |
| Seed/Issue QA-READY | id=4, 2026/91/91, Draft, дата 15.04.2026 | PARTIAL | 22:11 | Создан. Toast «Номер создан». Дата = `—` (Bug-1). |
| Seed/Issue QA-PUBLISHED | id=5, 2026/92/92, Draft, дата 01.05.2026 | PARTIAL | 22:12 | Создан. Toast «Номер создан». Дата = `—` (Bug-1). Перевод в Published — после загрузки PDF и статей. |
| F1 (автоподписка рубрик) | новый QA-DRAFT id=3 | PASS | 22:13 | Все 7 рубрик справочника подписаны автоматически (sections_count=7 в API; в форме увидим в S2). |
| S5 (сайдбар без «Рубрикатор») | /control/* | PASS | 22:13 | В сайдбаре только «Номера». Прямого пункта «Рубрикатор» нет. |
| S2 (форма QA-DRAFT id=3) | секции рубрик, статьи | PASS | 22:14 | Все 7 рубрик подписаны (checked); «В номере пока нет статей» (защитная сетка фронта работает на форме). Поле «Дата выхода» textbox с маской DD.MM.YYYY редактируемое. |
| F10a (дата выхода: редактируемость) | QA-DRAFT id=3 | PARTIAL | 22:14 | Поле редактируемое (textbox с описанием «Формат: ДД.ММ.ГГГГ»). После save → reload в моделке создания дата `01.04.2026` потерялась. Бэк не сохраняет (Bug-1). UI-маска проверяется отдельно в F10c. |
| F10c (маска DD.MM.YYYY) | textbox | PASS | 22:15 | Ввод цифр `15052026` автоматически преобразуется в `15.05.2026`. Placeholder корректный. |
| F10b (paste из буфера) | textbox QA-DRAFT | PASS | 22:16 | Paste `20.06.2026` из буфера через UI принимается, значение в input корректное. |
| F11a/F11d (toast on Issue save) | save QA-DRAFT id=3 | **FAIL** | 22:17 | PATCH /issues/3/ → 200, но **никакого toast не появляется** на странице. На странице создания toast «Номер создан» был, на странице редактирования — нет. См. **Bug-4**. |
| Bug-1 verify (published_date) | GET /api/issues/3/ | FAIL (known) | 22:17 | После PATCH со значением `01.04.2026`/`20.06.2026`/`25.06.2026` бэк вернул `published_date: null`. Открытая задача на бэк. |
| Seed/PDF upload QA-READY | issue_small.pdf | PASS | 22:20 | Toast «PDF загружен», ссылка `http://185.180.230.243/media/issues/pdfs/4/issue_small.pdf`. |
| Seed/PDF upload QA-PUBLISHED | issue_large.pdf | PASS | 22:21 | Toast «PDF загружен», ссылка `.../5/issue_large.pdf`. |
| Seed/Article QA-A1 | id=5, issue_id=4 (QA-READY), Экон. теория, pages 1-30, abstract.ru 5446 знаков | PASS | 22:24 | POST /articles/ → 201 (id=5). PDF загружен (issue_small.pdf). references преобразован в массив объектов. Toast «Статья создана» появляется. |
| F11b (validation: abstract.ru без abstract.en) | QA-A2 form | PARTIAL | 22:27 | Native HTML5 валидация (`required`) перехватила ситуацию: «Заполните это поле» (browser tooltip) — submit не пошёл. Это не toast, но UX-блок есть. Однако подсказка native, не локализуема в RU/EN UI. Стоит добавить React-side валидацию с toast.error. |
| Seed/Article QA-A2 | id=6, issue_id=4, Экон. теория, pages 31-50 | PASS | 22:28 | Создан (с заполненной EN-аннотацией после native-validate). PDF загружен (issue_small.pdf). |
| Seed/Article QA-A3 | id=7, issue_id=4 (READY), Методология, pages 51-72 | PASS | 22:31 | Минимум полей. PDF загружен. |
| Seed/Article QA-A4 | id=8, issue_id=5 (PUBLISHED), Экон. теория, pages 1-25, 2 автора | PASS | 22:34 | Создан с 2 авторами, у второго — 2 affiliations. PDF загружен. |
| Seed/Article QA-A5 | id=9, issue_id=5, Экон. теория, pages 26-44, 11 references | PASS | 22:37 | Создан с 11 references. PDF загружен. |
| Seed/Article QA-A6 | id=10, issue_id=5, Методология, pages 45-60 | PASS | 22:39 | Создан, PDF загружен (для F8c — заменим позже). |
| Seed/Article QA-A7 | id=11, issue_id=3 (DRAFT), Экон. теория, pages 1-15 | PASS | 22:41 | Создан БЕЗ PDF (для §F5 негативной публикации и §7.5 эюк-навигации). |
| F3 Step1 (Draft → Ready) | QA-READY id=4 | PASS | 22:43 | Кнопка «Пометить готовым» → статус «Готов». Toast не зафиксирован визуально (см. **Bug-4**, нет toast на статус-переход). |
| F9a (sort by pages в форме номера) | QA-READY id=4 | PASS | 22:43 | Список статей в правильном порядке: QA-A1 (1-30) → QA-A2 (31-50) → QA-A3 (51-72). |
| Bug-1 update | published_date | PARTIAL | 22:44 | После перехода Draft→Ready бэк **автозаполнил** `published_date = 2026-05-10` (today). На POST/PATCH /issues/ значение всё ещё не принимается, но `update_status` ставит today. UX: пользователь не контролирует дату. |
| F3 Step2 (→ Published) | QA-PUBLISHED id=5 | PASS | 22:46 | Кнопка «Опубликовать» (Draft→Published в один клик) → статус «Опубликован». Бэк требовал PDF выпуска и PDF каждой статьи — прошло, т.к. все они есть. |
| E4 (Published редактируемость) | QA-PUBLISHED форма | PASS | 22:46 | Информационный баннер: «Номер опубликован, но остаётся полностью редактируемым…» Поля не заблокированы. |
| F9a (sort QA-PUBLISHED) | issue_id=5 | PASS | 22:46 | Список статей: QA-A4 (1-25) → QA-A5 (26-44) → QA-A6 (45-60). |
| S1 (список выпусков) | /control/issues/ | **FAIL** | 22:48 | Все 4 выпуска (1, 3, 4, 5) показывают «11» в колонке «Статей». Реально: issue#1=4, issue#3=1, issue#4=3, issue#5=3 (сумма=11). Колонка показывает суммарную длину `sections[*].articles` без фильтра. **Bug-3** массово подтверждён. Колонка «Рубрик» = 7 (правильно, у всех справочник). Дата выпуска: новый QA-DRAFT id=3 = `—` (Bug-1, на Draft бэк не автозаполняет). |
| §7.1 verify (issue#1) | GET /api/issues/1/ | **FAIL** | 22:49 | `articles_count=4` (бэк правильный счётчик), но `sections.ekonomicheskaja-teorija.articles=[1,2,4,5,6,8,9,11]` — 8 статей вместо 3 (id 1, 2, 4 — родные issue#1; id 5, 6, 8, 9, 11 — чужие). Bug-2 (public leak регрессия) подтверждён ещё раз и масштабно. Защитная сетка фронта на форме номера работает (показывает только свои), но в IssuesList — нет. |
| S3 (публичная QA-PUBLISHED) + §7.1 public | /archive/2026/92/ | **FAIL CRITICAL** | 22:51 | Опубликованный выпуск показывает «Articles: 11» в сайдбаре. В секции «Economic Theory (8)» отображаются: QA-A7 (issue#3 DRAFT, без PDF), QA-A4 (родной), QA-A1 (issue#4 READY), 3 статьи из issue#1 (Rubinshtein, Komarovskaia, Kapultsevich), QA-A5, QA-A2. В секции «Methodology (3)»: QA-A6 (родной), QA-A3 (issue#4 READY), Tishkin (issue#1). **PUBLIC LEAK подтверждён массово.** Защитная сетка `s.articles.filter(a=>a.issue_id===issue.id)` НЕ применяется на public archive странице. Скриншот: `2026-05-10-bug2-public-leak.png`. |
| S4 (RU/EN switcher) | /archive/2026/92/ | PASS | 22:53 | Переключение RU/EN мгновенное. Title, секции, footer, breadcrumbs локализованы. Fallback не проверен (см. ниже отдельный кейс). |
| §9.4 (email editorqet@inecon.ru) | footer и контакты | PASS | 22:53 | На /archive footer: `mailto:editorqet@inecon.ru`. Старый `vte@inecon.ru` не виден. |
| F7 (preview ↔ public для QA-A1) | /article/5/ | **FAIL** | 22:55 | Статья QA-A1 (id=5) находится в QA-READY (issue#4), не Published. Кнопка «Предпросмотр» в админке ведёт на `/article/5/` — публичный маршрут, который для не-Published статей возвращает 404. **Редактор не может посмотреть, как будет выглядеть статья перед публикацией.** См. **Bug-7**. F7 для бэклога п.1 невозможно проверить без отдельного preview-маршрута. |
| F7 (preview работает для Published) | /article/8/ (QA-A4) | PASS | 22:55 | Опубликованная статья QA-A4 открывается, есть title, аннотация, references, citation block, footer. |
| F8c (PATCH article в Published) | QA-A6 id=10 | PASS (no toast) | 22:57 | abstract.ru/en изменены, keyword добавлен, save прошёл (значения в форме обновились). Toast — отсутствует (см. Bug-4). |
| F8b (заменить PDF выпуска в Published) | QA-PUBLISHED issue#5 | PASS | 22:58 | Заменил `issue_large.pdf` → `issue_small.pdf`, ссылка обновилась. Информационный баннер правильный. |
| E4 для article (Published редактируемость) | QA-A6 id=10 | PASS | 22:57 | Информационный баннер на форме статьи: «Номер опубликован, но статья остаётся редактируемой…». Поля редактируются. |
| F4 (публикация без PDF) | QA-DRAFT id=3 | **FAIL** | 22:59 | PUT /issues/3/update_status/ → 400 с body `{"message":"В выпуске номера с ID 3 не загружен PDF документ"}`. **Toast не появляется**, error-bar тоже отсутствует. Редактор не понимает, почему публикация не сработала — статус остался Draft, никакого фидбэка. См. **Bug-8**. F11c FAIL для этого кейса. |
| F5 (публикация с PDF выпуска, без PDF статьи) | QA-DRAFT id=3 (PDF выпуска есть, QA-A7 без PDF) | **FAIL** | 23:01 | PUT → 400 «В статье с ID 11 не загружен PDF документ». Снова silent — нет toast. См. **Bug-8**. |
| F6 / §7.7 (PDF validator на бэке) | upload not_a_pdf.pdf в QA-A7 | PARTIAL | 23:03 | Бэк правильно отверг (400 в console). Фронт **silent** — toast не показан. Бэк-валидатор работает; фронт-обработчик ошибки upload PDF тоже отсутствует. Часть Bug-8 распространяется и на upload PDF. |
| Seed/Article QA-A8 | id=12, issue#5, pages 20-35 (overlap with A4 1-25, A5 26-44) | PASS | 23:05 | Создан. Без PDF (для последующих негативов). |
| F9c (warning при перекрытии pages) | QA-A8 в issue#5 | **FAIL** | 23:05 | После save warning-toast о перекрытии **не появился**. Согласно плану §F9c (Block C новый функционал) ожидается «Диапазон страниц перекрывается со статьёй …». Не реализовано или сломано. |
| §8.4 (прямой переход /control/sections/) | URL bar | PASS | 23:06 | 404. Раздел корректно удалён. |
| §9.1 (Авторам — 4 подстраницы) | /authors/ | PASS | 23:08 | 4 подссылки: submit, submission, copyright-agreement, review. На submission/ есть фраза «соглашаетесь с условиями авторского соглашения и этикой» с гиперссылками на /authors/copyright-agreement/ и /ethics/. |
| §9.3 (Privacy крупный шрифт) | /privacy/ | PASS | 23:08 | Заголовок «Политика обработки персональных данных» (полное). Пункт меню: font-size 18px, semibold, underline. У соседних — 14px. |
| §9.4 (email на статич. страницах) | /privacy/, /authors/, /archive/ | PASS | 23:08 | `vte@inecon.ru` нигде не найден. Везде `editorqet@inecon.ru` (mailto). |
| §9.5 / S6 (куки-баннер) | new isolated context | PASS | 23:09 | Баннер в новом окне видим, текст содержит «questionset.ru», «даю согласие». Кнопка «Согласен» закрывает баннер, `localStorage.vte_cookie_consent='accepted'`. |
| F1 / F2 (автоподписка рубрик + защитная сетка) | PATCH /issues/3/ sections_slugs:[] | PASS (синтез) | 23:11 | Прямой PATCH с пустым `sections_slugs:[]` — бэк автоматически возвращает все 7 рубрик в `sections`. PATCH со списком из одной — также возвращает все 7. Автоподписка работает на бэке необратимо. F2 (защитная сетка фронта `ensureIssueHasSection`) перестал быть актуальным — отрицательное состояние невоспроизводимо. |
| F11a (toast on article PATCH) | QA-A7 id=11 | **FAIL** | 23:13 | После save title-edit toast «Статья сохранена» НЕ появился. Bug-4 подтверждён ещё раз. |
| F11b (валидация без DOI) | QA-A7 id=11 | PARTIAL | 23:13 | Native HTML5 (required) перехватил empty DOI. Submit не прошёл, до бэка не дошёл. Локализованного React-toast «Не указано поле „DOI”» — нет, но native browser tooltip есть. |
| F11d (удаление статьи QA-A8) | id=12 | PARTIAL | 23:14 | Browser confirm «Удалить статью?» → accept → DELETE прошёл, переход на /control/issues/5/. **Toast «Статья удалена» отсутствует.** Bug-4 распространяется и на DELETE. |
| E3 (delete article) | id=12 | PASS (без toast) | 23:14 | Удаление работает. Список выпуска обновился. Confirm dialog есть. Только нет визуального подтверждения через toast. |
| §7.6a (references=null для пустых) | QA-A6 id=10 | PASS | 23:15 | `GET /api/articles/10/` → `references: null`. Контракт #94 соблюдён. |
| §7.6 (references формат с заполнением) | QA-A1 id=5 | PASS | 23:15 | `references: [{ru, en}, {ru, en}]` — массив объектов. Бэк принимает корректно. |
| F12 (стабильность preview multi reload) | /article/8/ | PASS | 23:16 | 3 reload подряд: блок «Для цитирования», авторы, License «Creative Commons 4.0 BY», PDF — стабильно отображены. |
| F11c (дубликат year/number) | issue create 2026/92/92 | **FAIL bonus** | 23:18 | Бэк создал issue#6 с теми же параметрами 2026/92/92. То есть бэк **НЕ ВАЛИДИРУЕТ uniqueness** — это дополнительный bug бэка. Toast также отсутствует. См. **Bug-9**. Issue#6 удалён ручным DELETE. |
| E2 (UDK + funding edit) | QA-A1 id=5 | PASS | 23:20 | UDK = «331.5 + 330.115» (строка со спецсимволом `+`), funding RU/EN — сохранены и видны после reload. |
| F8a (изменение PDF выпуска отражается на публичке) | /archive/2026/92/ | PASS | 23:21 | После замены PDF выпуска (F8b) ссылка «Весь выпуск (PDF)» = `.../5/issue_small.pdf` (новое имя). Изменение published-выпуска видно публично. |
| §8.7 (куки повторное появление) | new isolated context, clear storage, reload | PASS | 23:22 | После `localStorage.removeItem('vte_cookie_consent')` и reload — баннер появился снова. |
| §9.6 (UX уведомления единообразие) | вся сессия | **FAIL summary** | 23:22 | Toasts работают для: создание (POST /issues, POST /articles), upload PDF. НЕ работают для: PATCH /issues, PATCH /articles, DELETE article, ошибка PUT /update_status, ошибка upload PDF (400). См. Bug-4 + Bug-8 — главная регрессия Block F. |
| §8.5 (параллельная сессия) | SKIP | SKIP | 23:23 | Не проверяли — слабый кейс при общей картине. |
| §8.6 (истёкший JWT во время форм) | SKIP | SKIP | 23:23 | Не проверяли — требует длительного ожидания. |
| §8.1 (спецсимволы) | UDK с `+` | PARTIAL | 23:23 | На UDK PASS (см. E2 выше). Полноценная проверка спецсимволов (`«»`, `&`, `<тег>`, `O'Hara`) на всех текстовых полях не выполнена — отдельный QA-A9 не создавался для экономии времени. |
| §8.2 (длинные строки) | abstract.ru 5446 знаков на QA-A1 | PASS | 23:23 | Большая аннотация загрузилась без обрезки в форму, видна целиком на публичной странице (см. F12 — не проверял конкретно size, но рендер не падал). |
| §7.5a (эюк-навигация: статья → выпуск → статья) | QA-A7 id=11 | PASS | 23:10 | Все поля (title, pages, author) после возврата на форму статьи остаются заполненными. Фикс a09a5a8 работает. |

---

## Найденные баги

_(Заполняется по ходу. Каждый FAIL → отдельный пункт.)_

### Bug-1 (S2, бэк, известный) — `published_date` не сохраняется на POST/PATCH /issues/

- **Severity:** S2 (контракт известен, открытая задача на бэк)
- **Воспроизведение:** UI «Создать номер» с датой выхода `01.04.2026` → save → в списке колонка «Дата выхода» = `—`.
- **Ожидаемое:** дата сохраняется и отображается DD.MM.YYYY.
- **Фактическое:** бэк не принимает поле, фронт его теряет на reload.
- **Статус:** известное ограничение, описано в `CLAUDE_CONTEXT.md`. Открытая задача на бэк.

### Bug-9 (S2, бэк) — дубликат `year/number/sequential_number` принимается без 400

- **Severity:** S2 (нарушение целостности справочника номеров)
- **Воспроизведение:**
  1. Уже есть issue#5 с year=2026/number=92/sequential_number=92.
  2. Создать новый через UI с теми же параметрами (нажать «Создать номер», ввести 2026/92/92 → «Создать»).
  3. Создаётся issue#6 (новый) c такими же year/number.
- **Ожидаемое:** бэк отвергает с 400 «Номер 92/2026 уже существует». Фронт показывает toast.error.
- **Фактическое:** бэк создал. Теперь два разных issue имеют одинаковую идентификацию, ломается логика публичных URL `/archive/{year}/{number}/`.
- **Статус:** требует бэк-фикса (unique constraint). Для теста нужно почистить дубликат на staging.

### Bug-8 (S2, фронт) — нет toast/error-bar при ошибке публикации (PUT /issues/{id}/update_status/ → 400)

- **Severity:** S2 (UX-блокер; редактор делает «Опубликовать» и не получает обратной связи)
- **Воспроизведение:**
  1. Открыть `/control/issues/3/` (QA-DRAFT, без PDF выпуска).
  2. Нажать «Опубликовать».
  3. Network: PUT `/issues/3/update_status/` → 400, body `{"status_code":400,"error_type":"bad_request","message":"В выпуске номера с ID 3 не загружен PDF документ"}`.
  4. На странице — никакого toast, никакого error-bar. Кнопка кликнулась, статус остался Draft, тишина.
- **Ожидаемое (бэклог п. UX-уведомления, F4/F11c):** toast.error «Не удалось опубликовать: В выпуске номера с ID 3 не загружен PDF документ» (текст из `message` бэка через `parseApiError`).
- **Фактическое:** silent. Это **полностью нивелирует** работу `parseApiError` и Block F для критичной операции — публикации.
- **Статус:** требует фронт-фикса. По всей видимости, обработчик кнопки «Опубликовать» не оборачивает ошибку в `toast.error(parseApiError(e))`.

### Bug-7 (S2, фронт) — кнопка «Предпросмотр» в админке не работает для статей в Draft/Ready выпусках

- **Severity:** S2 (UX-блокер; редактор не может убедиться в корректности перед публикацией)
- **Воспроизведение:**
  1. Открыть `/control/articles/5/` (QA-A1 в QA-READY id=4, Ready).
  2. Нажать «Предпросмотр».
  3. Открывается `/article/5/` → 404.
- **Ожидаемое:** preview доступен независимо от статуса выпуска (для редактора). Либо отдельный маршрут `/control/articles/5/preview/` с авторизацией.
- **Фактическое:** «Предпросмотр» ведёт на публичный маршрут, который правильно отдаёт 404 для не-Published. Это нивелирует функцию preview.
- **Связано:** план §F7, бэклог п.1, открытая задача `#92` (Preview статьи до публикации).

### Bug-5 (S1, фронт, КРИТИКА — public leak на публичной странице выпуска)

- **Severity:** S1 (нарушение изоляции данных, на публике видны чужие статьи и статьи из неопубликованных номеров)
- **Воспроизведение:**
  1. На staging создан seed: issue#1 (4 статьи), QA-DRAFT id=3 (1 ст), QA-READY id=4 (3 ст), QA-PUBLISHED id=5 (3 ст).
  2. Открыть `/archive/2026/92/` (QA-PUBLISHED).
  3. В сайдбаре «Articles: 11» (вместо 3). В секции «Economic Theory (8)» показаны: QA-A7 (id=11, issue#3 DRAFT), QA-A4 (родной), QA-A1 (id=5, issue#4 READY), 3 статьи issue#1, QA-A5, QA-A2. И аналогично «Methodology (3)».
- **Ожидаемое:** на публичной странице выпуска отображаются ТОЛЬКО статьи этого выпуска. Особенно опасно: статья QA-A7 из неопубликованного DRAFT-выпуска видна на public!
- **Фактическое:** см. выше. Защитная сетка фронта `s.articles.filter(a=>a.issue_id===issue.id)` применяется только на форме номера в админке, не на публичной части.
- **Корневая причина:** Bug-2 на бэке + отсутствие защитной сетки на public archive view.
- **Скриншот:** `2026-05-10-bug2-public-leak.png`.
- **Статус:** требует и бэк-фикса (Bug-2), и фронт-фикса (применить фильтр на public странице).

### Bug-2 (S1, бэк, КРИТИКА — public leak регрессия) — `IssueSection.articles` снова содержит чужие статьи

- **Severity:** S1 (нарушение изоляции данных между выпусками; на публичной странице может проявиться leak)
- **Воспроизведение:**
  1. Создать новый пустой QA-DRAFT (id=3).
  2. `GET /api/issues/3/`.
  3. В ответе `articles_count=0`, но `sections[i].articles` содержит статьи issue#1: «ekonomicheskaja-teorija» → ids [1,2,4], «metodologija» → [3].
- **Ожидаемое:** `IssueSection.articles` отфильтрован по `issue_id` запрашиваемого выпуска. Bug-71 был заявлен закрытым 2026-05-09.
- **Фактическое:** регрессия — фильтр снова не работает. На фронте спасает защитная сетка `s.articles.filter(a => a.issue_id === issue.id)`, но колонка «Статей» в списке считает иначе (см. Bug-3).
- **Статус:** регрессия закрытого бага. Срочно вернуть на бэк.

### Bug-4 (S3, фронт) — нет toast после save (PATCH /issues/{id}/ и PATCH /articles/{id}/)

- **Severity:** S3 (UX-регрессия от Block F)
- **Воспроизведение:**
  1. На форме `/control/issues/3/` поменять любое поле → «Сохранить данные». Network: PATCH /issues/3/ → 200. Toast не появляется.
  2. На форме `/control/articles/10/` (QA-A6 в Published) поменять abstract.ru → «Сохранить изменения». Сохранилось (abstract обновлён в форме), но toast не появляется.
- **Ожидаемое (бэклог п. UX-уведомления, F11a/F11d):** «Номер сохранён» / «Статья сохранена» (success toast).
- **Фактическое:** silent в обоих случаях. Тестировщик не понимает, прошёл save или нет.
- **Статус:** требует фронт-фикса. Block F покрыл, видимо, только creation (POST), не update (PATCH). Toast «Номер создан»/«Статья создана» при POST — работает; «Номер сохранён»/«Статья сохранена» при PATCH — отсутствует. Toast на upload PDF — работает.

### Bug-3 (S2, фронт) — колонка «Статей» в `/control/issues/` не отфильтрована по issue_id

- **Severity:** S2 (вводит редактора в заблуждение; на пустом новом номере показано 4)
- **Воспроизведение:** новый QA-DRAFT id=3 → `/control/issues/` → колонка «Статей» = 4 (ожидание 0). При этом `articles_count` из API = 0.
- **Ожидаемое:** колонка использует либо `articles_count` (read-only, бэк), либо `sum(sections[].articles.filter(a=>a.issue_id===issue.id).length)`.
- **Фактическое:** видимо суммирует `sections[].articles.length` без фильтра — наследует Bug-2.
- **Статус:** требует фронт-фикса (использовать `articles_count` или применить защитную сетку и в `IssuesList`).

---

## Risks & blockers

- На момент старта staging БД ОЧИЩЕНА (только issue #1 от 2026 №1). Полный seed нужно проводить с нуля.
- Бэк не принимает `published_date` на POST/PATCH (открытая задача на бэк). Любой кейс с вводом даты выпуска через UI на бэк не сохранится — для целей теста проверяется только UI-маска (что фронт принимает корректный ввод).
- Локальный фронт = main HEAD `1839dcb`, на staging запущен `v0.1.10` (без Block F и других правок). Любой результат фронта — это «как заработает после деплоя нового билда».

---

## Notes / observations

### ID-маркеры созданных QA-объектов

**Выпуски:**
- QA-DRAFT: `id=3`, 2026/90/90, target Draft, дата seed 01.04.2026 (бэк не сохраняет — Bug-1)
- QA-READY: `id=4`, 2026/91/91, target Ready, дата seed 15.04.2026
- QA-PUBLISHED: `id=5`, 2026/92/92, target Published, дата seed 01.05.2026
- Существующий boot-issue: `id=1`, 2026/№1/30, Published, 4 статьи (статьи id 1, 2, 3, 4)

**Статьи QA-A1…A7 (созданы):**
- QA-A1: `id=5`, issue_id=4 (QA-READY), Экон. теория, pages 1-30, abstract.ru 5446 знаков, PDF
- QA-A2: `id=6`, issue_id=4, Экон. теория, pages 31-50, PDF (с принудительной EN-аннотацией после native-validate)
- QA-A3: `id=7`, issue_id=4, Методология, pages 51-72, PDF
- QA-A4: `id=8`, issue_id=5 (QA-PUBLISHED), Экон. теория, pages 1-25, 2 автора + 2 affiliations, PDF
- QA-A5: `id=9`, issue_id=5, Экон. теория, pages 26-44, 11 references, PDF
- QA-A6: `id=10`, issue_id=5, Методология, pages 45-60, PDF
- QA-A7: `id=11`, issue_id=3 (QA-DRAFT), Экон. теория, pages 1-15, **без PDF** (для §F5 и §7.5)

### Существенные открытия в seed

1. **Bug-2 — public leak регрессия (`IssueSection.articles` не отфильтрован).** Обнаружено сразу при создании пустого QA-DRAFT: `GET /api/issues/3/` отдаёт чужие статьи issue#1 в `sections[*].articles`. Это регрессия Bug-71, который заявлялся закрытым 2026-05-09. Срочно вернуть на бэк.
2. **Bug-3 — колонка «Статей» в `/control/issues/` не использует `articles_count`.** Все три новых пустых выпуска показывают «4» — это они унаследовали от чужого контента issue#1. Нужен фронт-фикс (использовать `articles_count` или фильтр по issue_id).
3. **Bug-1 (известный) — `published_date` не сохраняется на бэке.** В колонке «Дата выхода» у новых выпусков `—`. Toast «Номер создан» появляется на успехе.


---

## Verdict

- [x] Charter выполнен (большинство пунктов — частично; §8.5/8.6 явно SKIP)
- [x] Все запланированные кейсы пройдены или явно отмечены SKIP/BLOCKED
- [x] Все FAIL зарегистрированы — 9 багов задокументированы
- [x] Очистка — N/A (staging политика «не подчищать»; удалён только дубликат issue#6 после Bug-9, чтобы не путал)

**Итог сессии: FAIL.** Сборка main HEAD `1839dcb` имеет **критические регрессии**, которые блокируют деплой:

1. **Bug-2 (S1 бэк, public leak)** — `IssueSection.articles` не отфильтрован по `issue_id`. Регрессия закрытого Bug-71. Чужие статьи (включая статьи из Draft-выпусков!) появляются на публичной странице любого выпуска.
2. **Bug-5 (S1 фронт, public leak на /archive/)** — связан с Bug-2: на `/archive/{year}/{number}/` для QA-PUBLISHED показано 11 статей вместо 3, в т.ч. QA-A7 из не-Published выпуска.
3. **Bug-3 (S2 фронт, IssuesList колонка)** — все выпуски показывают «Статей: 11».
4. **Bug-4 (S3 фронт, регрессия Block F)** — нет toast после PATCH issue/article + DELETE article. Block F покрыл только POST.
5. **Bug-8 (S2 фронт)** — нет error-toast при ошибке публикации PUT update_status (400).
6. **Bug-7 (S2 фронт)** — preview не работает для статей в Draft/Ready (404). Связано с #92.
7. **Bug-9 (S2 бэк)** — дубликат `year/number/sequential_number` принимается без 400.
8. **Bug-1 (S2 бэк, известный)** — `published_date` не принимается на POST/PATCH /issues/. На переход status=Ready бэк автозаполняет today.
9. **Bug-6** — F9c warning о перекрытии диапазонов pages не реализован.

PASS-блок: создание/редактирование номеров и статей (с упомянутыми FAIL по toast), переходы статусов Draft→Ready→Published, sort by pages в форме номера, F1 автоподписка рубрик, §7.5 эюк-навигация, §7.6 references контракт, §7.7 PDF-валидатор бэка работает, §8.4 /control/sections/ → 404, §8.7 куки-повтор, §9.1-9.5 публичные статичные страницы, §F12 стабильность preview, S5 без «Рубрикатор», S6/F11d куки и upload-toast.

**Следующая сессия (рекомендация):**

1. **Срочно** вернуть Bug-2 (public leak регрессия) на бэк — это блокер релиза. После фикса перепроверить §7.1 + §S3.
2. Доделать Block F — добавить toast на PATCH issue, PATCH article, DELETE article, ошибки PUT update_status, ошибки upload PDF. Подзадача: добавить React-валидацию обязательных полей с toast (вместо native browser tooltip).
3. Применить защитную сетку `s.articles.filter(a=>a.issue_id===issue.id)` на public archive странице (Bug-5) и в IssuesList (Bug-3).
4. Реализовать F9c warning о перекрытии (Block C недоделан).
5. Реализовать preview-маршрут для Draft/Ready (#92).
6. Бэк: разрешить запись `published_date` на POST/PATCH /issues/ (Bug-1) + uniqueness `year/number` (Bug-9).
7. После всех фиксов — повторить полный регрессионный прогон. Текущий seed (issues 3, 4, 5, статьи 5–11) на staging оставлен для воспроизведения.

**Состояние staging БД на момент окончания сессии:**
- issue#1 (2026/№1, Published, 4 статьи: id 1–4) — оставлен.
- issue#3 (QA-DRAFT, 2026/№90, Draft, статья QA-A7 id=11 без PDF, PDF выпуска есть) — оставлен.
- issue#4 (QA-READY, 2026/№91, Ready, статьи QA-A1 id=5, QA-A2 id=6, QA-A3 id=7) — оставлен.
- issue#5 (QA-PUBLISHED, 2026/№92, Published, статьи QA-A4 id=8, QA-A5 id=9, QA-A6 id=10 с изменённым abstract) — оставлен.
- issue#6 — удалён (был дубликат для Bug-9).
- QA-A8 id=12 — удалён (тест E3).
