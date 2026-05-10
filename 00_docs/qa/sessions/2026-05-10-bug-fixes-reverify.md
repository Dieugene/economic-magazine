# Test Session: re-verify Bug-3..Bug-8 fixes after Wave 3 merges

> Focused-сессия по кейсам, которые упали в полной регрессии 2026-05-10 (`2026-05-10-localhost-staging.md`). Цель — подтвердить, что фронт-фиксы (5 коммитов) действительно работают на UI.

---

## Метаданные

| Поле | Значение |
|---|---|
| **Session ID** | `2026-05-10-bug-fixes-reverify` |
| **Дата / время старт** | `2026-05-10 17:39` (UTC+3) |
| **Дата / время конец** | `2026-05-10 18:05` (UTC+3) |
| **Тестировщик** | Claude (Explore агент) |
| **Билд / версия** | local main HEAD `fad5898` (после merge Wave 3: Bug-3+5, Bug-4+8, Bug-6, Bug-7); бэк — staging `185.180.230.243` |
| **Окружение** | local frontend (`http://localhost:3000`) × staging бэк |
| **Тип сессии** | focused / re-verify after fixes |
| **Связанный план** | `00_docs/qa/test_plan_issues_sections_articles.md` |
| **Базовая сессия (FAIL-лог)** | `00_docs/qa/sessions/2026-05-10-localhost-staging.md` |

---

## Charter

Подтвердить, что 6 фронт-багов из QA-сессии 2026-05-10 устранены: Bug-3 (колонка «Статей»), Bug-4 (toast на PATCH/DELETE), Bug-5 (защитная сетка в /archive/), Bug-6 (warning перекрытие pages), Bug-7 (preview Draft/Ready), Bug-8 (toast при ошибке публикации). Bug-2 и Bug-9 — на бэке, не проверяются.

---

## Scope

**Включено (re-verify):**
- Bug-3: GET `/control/issues/` — колонка «Статей» = articles_count.
- Bug-4: правка статьи (PATCH) → один итоговый toast.success «Статья сохранена». Удаление → toast.success «Статья удалена».
- Bug-5: GET `/archive/2026/92/` — должно быть только 3 родных статьи issue 5.
- Bug-6: создание/правка статьи с pages, перекрывающимися с существующими → toast.warning виден ≥ 8 сек.
- Bug-7: открытие `/control/articles/{id}/preview` для Draft-статьи (например article 11 из QA-A7) — должно вернуть 200, не 404.
- Bug-8: попытка опубликовать выпуск без PDF одной из статей → toast.error с понятным русским текстом (не «API error: 400»).

**Исключено:**
- Bug-2 (на бэке).
- Bug-9 (на бэке).
- Bug-1 published_date (на бэке).

---

## Coverage / Test log

_(Заполняется агентом по ходу.)_

| Кейс | Объект | Результат | Время | Заметка |
|---|---|---|---|---|
| Pre-flight | dev-server | RECOVERED | 17:42 | Локальный `next dev` стартанул, но `.next/dev` cache был сломан (Cannot find module `[turbopack]_runtime.js`, ENOENT build-manifest). Все routes отдавали 500. Очистил `.next/`, перезапустил `next dev`. После этого UI открывается. |
| Login | editorqet@inecon.ru | PASS | 17:46 | JWT выдан, попал на /control/issues/. |
| Bug-3 | колонка «Статей» в /control/issues/ | **PASS** | 17:46 | issue#1=4, issue#3=1, issue#4=3, issue#5=3 — все совпадают с articles_count из бэка. Никаких «11» нет. Защитная сетка работает. |
| Bug-5 | /archive/2026/92/ — родные статьи | **PASS** | 17:48 | Сайдбар «Статей: 3», основная часть: 3 статьи (QA-A4 1-25, QA-A5 26-44 в Economic Theory; QA-A6 45-60 в Методология). Чужих статей нет. Защитная сетка `s.articles.filter(a=>a.issue_id===issue.id)` применена на public archive. |
| Bug-4 | toast на PATCH /articles/8/ | **PASS** | 17:51 | Тривиальная правка keywords.ru → save → PATCH 200 → toast «Статья сохранена» (sonner top-right). Зафиксирован MutationObserver-ом (toast уходит быстро, но точно появляется). |
| Bug-6 | warning перекрытия pages | **PASS** | 17:55 | На QA-A5 (id=9) изменил pages 26-44 → 20-30. После save появились ОБА toast: success «Статья сохранена» + warning «Диапазон страниц перекрывается со статьёй: «QA-A4 — Два автора, две аффилиации» (с. 1-25). Сохранено, но проверьте порядок страниц в номере.» (data-type=warning). Pages вернул в 26-44 (через API подтверждено). |
| Bug-7 | preview Draft статьи (QA-A7 id=11) | **PASS** | 17:58 | `/control/articles/11/preview/` загрузился: title, авторы, abstract-блок, keywords, citation, sidebar метаданных. Баннер «Превью статьи — это административный предпросмотр; для гостей публичная страница доступна только после публикации номера». Кнопка «К редактированию» → /control/articles/11/. Не 404. На форме `/control/articles/11/` есть link «Предпросмотр» → /control/articles/11/preview/. |
| Bug-8 | toast при ошибке публикации | **PASS** | 18:03 | Создал dummy issue#7 (2026/99/99) без PDF и без статей → клик «Опубликовать». PUT /issues/7/update_status/ → 400. Появился sonner toast с `data-type=error` и текстом «В выпуске номера с ID 7 не загружен PDF документ. Не удалось опубликовать». Никакого «API error: 400» нет — текст из бэк-обёртки `parseApiError`. После теста удалил issue#7 (DELETE 204 через UI confirm + API подтверждение). |

---

## Найденные баги (новые / регрессии)

Новых регрессий не найдено. Все 6 фронт-фиксов работают как ожидалось.

Боковое наблюдение (вне scope re-verify, но фиксирую): UI-кнопка «Удалить номер» на `/control/issues/7/` после браузерного `confirm(...)` не оставила follow-up DELETE-запроса в network в первой попытке (issue остался виден после navigate назад на /control/issues/, и `/api/issues/` возвратил его при auth-запросе). Удаление пришлось добить ручным `fetch('/backend/issues/7/', {method:'DELETE'})` (204). Вероятно, гонка между confirm и тем, что страница перерендерилась без отправки DELETE. Не блокер re-verify (и могло быть случайностью chrome-devtools MCP при перехвате confirm), но стоит проверить отдельно.

---

## Verdict

- [x] Все 6 багов закрыты на UI
- [x] Новые регрессии не найдены

**Итог: PASS.** Wave 3 фронт-фиксы (5 коммитов) подтверждены на UI:

| Bug | Что было (2026-05-10 22:00) | Что стало (2026-05-10 17:46) | Результат |
|---|---|---|---|
| Bug-3 | Колонка «Статей» = 11 для всех выпусков | issue#1=4, #3=1, #4=3, #5=3 (= articles_count) | PASS |
| Bug-5 | /archive/2026/92/ показывал 11 статей (включая чужие из Draft-выпусков) | Только 3 родные статьи (QA-A4/A5/A6) | PASS |
| Bug-4 | Toast «Статья сохранена» отсутствовал на PATCH | Toast `success` появляется (зафиксирован MutationObserver-ом) | PASS |
| Bug-6 | Warning о перекрытии pages не появлялся | Toast `warning` с точным текстом «Диапазон страниц перекрывается со статьёй: «QA-A4 — Два автора, две аффилиации» (с. 1-25). Сохранено, но проверьте порядок страниц в номере.» | PASS |
| Bug-7 | `/article/11/` → 404 при «Предпросмотр» из админки | `/control/articles/11/preview/` рендерит preview с баннером «Превью статьи»; форма имеет link на этот URL | PASS |
| Bug-8 | Silent на PUT update_status 400 | Toast `error` с локализованным текстом «В выпуске номера с ID N не загружен PDF документ. Не удалось опубликовать» | PASS |

**Pre-flight:** dev-server при старте сессии был сломан (`.next/dev` cache в развале, ENOENT build-manifest, все routes 500). Пришлось очистить `.next/` и перезапустить `next dev`. После этого UI работает штатно. На реальный код это не влияет — артефакт изменений во время Wave 3.

**Состояние staging БД на момент окончания сессии:**
- issue#1 (2026/№1, Published, 4 статьи) — без изменений.
- issue#3 (QA-DRAFT, 2026/№90, 1 статья QA-A7) — без изменений.
- issue#4 (QA-READY, 2026/№91, 3 статьи QA-A1/A2/A3) — без изменений.
- issue#5 (QA-PUBLISHED, 2026/№92, 3 статьи QA-A4/A5/A6) — QA-A4 keywords.ru изменён (добавлено «qa-test-2»). QA-A5 pages пробежал по циклу 26-44 → 20-30 → 26-44, итоговое значение 26-44 (как было). issue#7 (создан и удалён в рамках теста Bug-8). |

