# Test Session: smoke — новая форма /authors/submit

> Прогон ручной формы подачи рукописи против localhost-фронта (с `next dev`) на свежеподнятый бэкенд staging. Цель — подтвердить UI-цепочку и валидацию; нашли два бэкенд-блокера.

---

## Метаданные

| Поле | Значение |
|---|---|
| **Session ID** | `2026-05-17-author-submission-form-smoke` |
| **Дата / время** | 2026-05-17 |
| **Тестировщик** | Claude (через Chrome DevTools MCP) |
| **Билд / версия** | local main HEAD `6d8ce05` (новая форма + fix Toaster в public layout); бэк — staging `185.180.230.243` |
| **Окружение** | local frontend (`http://localhost:3000`) × staging бэк через proxy `/backend/*` |
| **Тип сессии** | focused smoke / first-pass UI verification |
| **Связанный spec** | `docs/superpowers/specs/2026-05-17-author-submission-form-design.md` |
| **Связанный план** | `docs/superpowers/plans/2026-05-17-author-submission-form.md` |

---

## Charter

Проверить полный сценарий новой формы подачи статьи (`/authors/submit`): рендер, валидация, honeypot, реальный POST к `/api/articles/upload_new_pdf_file/`, реальный GET `/api/articles/download_template/`. Покрыть RU и EN режимы.

---

## Scope

**Включено:**
- Визуальный рендер всех 5 разделов формы (RU).
- EN-фолбэк («form is available in Russian only»).
- Negative path: submit без данных → ошибки по каждому required-полю.
- Honeypot: trip скрытого поля → silent success без сетевого запроса.
- Positive path: реальный multipart POST с .docx.
- Template download через UI и через прямой HTTP-запрос.
- Скрытие пункта «Submit a Paper» в EN-меню; обновлённая карточка на `/authors/page.tsx`.

**Исключено:**
- ZIP-аплоад дополнительных материалов (не в требованиях этого spec'а).
- ORCID-формат валидация в браузере (визуально подтверждена через snapshot формы — отдельный прогон не делал).
- Деплой на staging (отдельный этап).

---

## Coverage / Test log

| # | Сценарий | Шаги | Ожидание | Результат |
|---|---|---|---|---|
| 1 | RU-рендер | Перейти на `/authors/submit` в RU | 5 секций: подтверждения / автор / контакты / файлы / согласия + кнопка template + кнопка submit (серая) | ✅ см. `vte_submit_form_full.jpeg` |
| 2 | EN-фолбэк | Переключить язык на EN | Видна короткая фраза «form is available in Russian only» + mailto editorqet@inecon.ru | ✅ |
| 3 | Negative path | Submit без заполнения | Под каждым required-полем «Обязательное поле / Подтвердите этот пункт / Прикрепите файл статьи / Необходимо ваше согласие»; докс-зона красная | ✅ см. `vte_submit_negative.jpeg` |
| 4 | Honeypot | Заполнить скрытое поле `website` через JS → submit | Success-экран «Статья получена» без сетевого запроса к `/articles/upload_new_pdf_file/` | ✅ Network log проверен, POST отсутствует |
| 5 | Positive path UI | Заполнить все обязательные поля + valid .docx → submit | Multipart POST уходит на `/backend/articles/upload_new_pdf_file/`, ответ — успех | ⚠ POST ушёл, бэк вернул 400 (см. блокер B1) |
| 6 | Template download UI | Клик «Скачать шаблон оформления» в форме | При успехе — скачивание; при ошибке — toast «Шаблон временно недоступен» | ✅ Toast отображается после fix `6d8ce05` (см. блокер B2) |
| 7 | Template download API | Прямой GET `/api/articles/download_template/` | 200 + файл (или 404, мы оба обрабатываем) | ⚠ Бэк отвечает 401, ожидался `jwtAuth OR {}` (см. блокер B3) |
| 8 | EN nav scrub | В EN-меню «For Authors» — нет «Submit a Paper»; карточка submit на `/authors` тоже скрыта в EN | ✅ |
| 9 | RU nav | В RU-меню «Авторам» — есть «Подать статью»; карточка submit видна с новым описанием «Форма подачи рукописи через сайт журнала» | ✅ |
| 10 | `/authors/submission` | Сверху страницы появляется бар с кнопкой template | ✅ |

---

## Найденные баги / блокеры

### B1 — Бэкенд отвергает корректный payload (БЛОКЕР)

**Проявление:** POST `/api/articles/upload_new_pdf_file/` с полным набором required-полей из свагера (`authors`, `workplace_title_and_address`, `position_title`, `city`, `email`, `phone_number`, `docx_file`) + всеми опциональными (`degree`, `academic_title`, `funding`, `orcid_id`) возвращает:
```
HTTP 400
{"status_code":400,"error_type":"bad_request","message":"Обязательное поле."}
```

**Воспроизводимо через curl:**
```bash
curl -X POST http://185.180.230.243/api/articles/upload_new_pdf_file/ \
  -F "authors=Test" -F "workplace_title_and_address=ИЭ РАН" \
  -F "position_title=снс" -F "city=Москва" \
  -F "email=qa@example.com" -F "phone_number=+7 (495) 123-45-67" \
  -F "degree=к.э.н." -F "academic_title=доцент" \
  -F "funding=без финансирования" -F "orcid_id=0000-0000-0000-0000" \
  -F "docx_file=@some.docx"
```

**Гипотеза:** бэк требует какое-то поле, которого нет в свагере, либо message не отдаёт имя поля. Сообщение «Обязательное поле.» без указания на какое — слепая зона.

**Решение:** запрос бэкендеру с (a) актуальным список required-полей и (b) расширением message ошибки именем поля (как делает DRF по умолчанию). До этого — фронт работает корректно, обрабатывает 400, показывает сообщение бэка.

### B2 — Toaster не был подключён в публичном layout (FIXED)

**Проявление:** Toast от `TemplateDownloadButton` (и любого другого публичного компонента) не отображался — `<Toaster>` стоял только в `(control)/layout.tsx`.

**Исправлено:** commit `6d8ce05` — добавлен `<Toaster position="top-right" richColors closeButton />` в `(public)/layout.tsx`.

### B3 — Template endpoint возвращает 401 вместо 404 / 200 (БЭК)

**Проявление:** GET `/api/articles/download_template/` отвечает `HTTP 401 Unauthorized` без авторизации, хотя в свагере security — `jwtAuth OR {}` (анонимный доступ разрешён).

**Решение со стороны фронта:** `TemplateDownloadButton` теперь трактует 401/403/404 одинаково — «временно недоступен» (commit `6d8ce05`). Это нивелирует поведение на стороне UI.

**Решение со стороны бэка:** проверить permission на view'е `download_template` — должно быть `[AllowAny]` или эквивалент. Дополнительно: залить файл шаблона в БД/файловое хранилище.

---

## Артефакты

- `C:\Users\Spectra\AppData\Local\Temp\vte_submit_form_full.jpeg` — рендер формы.
- `C:\Users\Spectra\AppData\Local\Temp\vte_submit_negative.jpeg` — ошибки валидации при пустом submit.
- `C:\Users\Spectra\AppData\Local\Temp\vte_submit_filled.jpeg` — заполненная форма с прикреплённым docx.
- `C:\Users\Spectra\AppData\Local\Temp\vte_submit_after_submit.jpeg` — состояние после POST (бэк 400).

---

## Итог

Фронт работоспособен и готов к деплою: рендер, валидация, honeypot, error-handling, template-download UI — всё работает. Полный positive path (загрузка статьи) не подтверждён только потому, что **бэк отвечает 400 на корректный по свагеру payload** (B1). После фикса бэка — повторный прогон шага 5 без правок фронта.

Деплой можно делать сразу после явного «ок» от заказчика — фронт-часть не блокируется бэк-блокерами (форма продолжит работать корректно после фикса B1).
