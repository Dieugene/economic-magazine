# Customer Feedback Batch 2 — Design

**Дата:** 2026-05-23
**Источник:** `00_docs/qa/2025-05-22/Тестирование.docx` (от заказчика)
**Скоуп:** 11 точечных правок UI/контента по форме `/authors/submit` и страницам «Порядок подачи…» / «Порядок рецензирования…».
**Не входит:** новая архитектура, новые компоненты, изменения API/контракта.

---

## 1. Цели

Закрыть второй раунд правок от заказчика. Все правки точечные: текст, цвета, мелкая логика поля телефона, один баг (сброс данных при загрузке файла), замена статичного списка REFERENCES.

## 2. Маппинг «пункт заказчика → файл → изменение»

### Форма подачи (`/authors/submit`)

#### Bug 1. Сброс данных формы при загрузке файла
- **Файл:** `02_src/vte-frontend/src/components/public/submit/SubmissionForm.tsx` (точка фикса — window-level листенеры на mount).
- **Симптом по описанию заказчика:** при выборе файла «сбрасываются данные страницы». Гипотеза заказчика — авто-отправка при выборе.
- **Repro 2026-05-23 (Chrome MCP против staging):**
  - Заполнил все поля + 7 чекбоксов, через DataTransfer положил файл в input — state остаётся, никаких сетевых запросов к `/articles/upload_new_article/`.
  - В коде: `submitManuscript` вызывается только в `SubmissionForm.handleSubmit` (по сабмиту), нет useEffect-ов на изменение файла.
  - **Глобальных `preventDefault` для `dragover`/`drop` нет** (`window.ondragover === false`, `document.ondragover === false`).
- **Корень:** при drag&drop файла с рабочего стола, если пользователь **промахивается** мимо drop-zone и роняет файл в любое другое место страницы, браузер по умолчанию **открывает файл в текущей вкладке** — это и есть «сброс данных». Стандартная ловушка веб-форм с drop-zone, давно известный класс багов.
- **Фикс:** в `SubmissionForm.tsx` навесить window-level листенеры `dragover`/`drop` с `preventDefault()` через `useEffect` на mount, с cleanup при unmount. Наш специфичный handler в `DropArea.onDrop` отработает раньше (через event bubbling), window catch-all перехватит только промахи.
- **Acceptance:** заполнил поля, перетащил docx из проводника **мимо** drop-zone (в любое место страницы) — поля сохраняются, файл не открывается в браузере. Drop в саму зону работает как раньше.

#### Edit 2. DeclarationsBlock: «договора» → «авторского соглашения» с гиперссылкой
- **Файл:** `02_src/vte-frontend/src/components/public/submit/DeclarationsBlock.tsx`.
- **Текущее:** массив `ITEMS` хранит строки. Пятый пункт: `label: "Автор (соавторы) принимает условия договора"`.
- **Изменение:** разрешить `label: ReactNode` (или ввести отдельное поле `node`), для declAgreement подставить:
  > Автор (соавторы) принимает условия [авторского соглашения](/authors/copyright-agreement)
- **Стиль ссылки:** тот же `text-teal-600 hover:text-copper-400 underline underline-offset-2`, что в ConsentsBlock (для согласованности). `target="_blank"` — да, как в ConsentsBlock.
- **Acceptance:** в пункте видно «авторского соглашения» как ссылка, открывается `/authors/copyright-agreement` в новой вкладке.

#### Edit 3. «Рабочая почта» → «Почта»
- **Файл:** `02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx:26`.
- **Изменение:** label «Рабочая почта» → «Почта».
- **Acceptance:** label поля email = «Почта».

#### Edit 4. Drop-zone: убрать красную подсветку при error
- **Файл:** `02_src/vte-frontend/src/components/public/submit/FilesBlock.tsx:63-69`.
- **Текущее:** при `error` drop-zone подсвечивается `border-red-400 bg-red-50/30`.
- **Изменение:** удалить error-ветку из className drop-zone — оставить нейтральные стили (`border-stone-400 bg-stone-50 hover:border-copper-300`) для error-состояния тоже. Текст ошибки под зоной (FilesBlock.tsx:106 `<p className="text-xs text-red-600 mt-1">{error}</p>`) остаётся красным — он несёт диагностику.
- **Acceptance:** при пустом docx + клике «Отправить» зона остаётся серой/нейтральной, но под ней появляется красный текст ошибки.

#### Edit 5. ORCID placeholder: `X` → `0`
- **Файл:** `02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx:114`.
- **Изменение:** `placeholder="0000-0000-0000-000X"` → `placeholder="0000-0000-0000-0000"`.
- **Регулярка валидации (`lib/validation/submission.ts:10` `ORCID_RE`) НЕ меняется** — стандарт ORCID допускает `X` как контрольную цифру (mod 11-2). Принудительно убирать `X` из валидации сломает реальных авторов.
- **Acceptance:** placeholder отображает только нули; ввод `0000-0000-0000-0001` и `0000-0000-0000-000X` проходит валидацию.

#### Edit 6. AuthorDataBlock: «(соавторов через запятую)» во всех полях блока
- **Файл:** `02_src/vte-frontend/src/components/public/submit/AuthorDataBlock.tsx`.
- **Текущее:**
  - ФИО автора (соавторов через запятую) — уже есть.
  - Место работы (название и адрес) — нет.
  - Должность — нет.
  - Город — нет.
- **Изменение:**
  - «Место работы (название и адрес)» → «Место работы (название и адрес, соавторов через запятую)».
  - «Должность» → «Должность (соавторов через запятую)».
  - «Город» → «Город (соавторов через запятую)».
- **Acceptance:** все 4 поля блока «Автор / соавторы» содержат пометку «(соавторов через запятую)» в label.

#### Edit 7. ContactsBlock: подпись к заголовку
- **Файл:** `02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx:21`.
- **Текущее:** `<FormSection title="Контакты и дополнительные сведения">` — без description.
- **Изменение:** добавить `description="в случае наличия одного и более соавторов указываются контактные данные одного автора, выбранного для контакта с редакцией"`.
- **Технически:** компонент `FormSection` уже принимает `description` (FormSection.tsx:4-17). Никаких новых компонентов не нужно.
- **Acceptance:** под заголовком «Контакты и дополнительные сведения» отображается серым текстом пояснение.

#### Edit 11. Телефон: автоподстановка «+» и нормализация 8→7
- **Файлы:** `02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx` (поле), возможно отдельный хелпер в `lib/`.
- **Логика нормализации (применяется в `onChange`):**
  1. Если ввод пустой — оставить пустым (не подставлять «+», чтобы placeholder работал).
  2. Достать из ввода только цифры.
  3. Если первая цифра «8» — заменить на «7».
  4. Префиксировать «+».
  5. Вернуть строку.
- **Поведение для пользователя:**
  - Ввёл `8` → стало `+7`.
  - Ввёл `89991234567` → стало `+79991234567`.
  - Ввёл `+79991234567` → осталось `+79991234567`.
  - Ввёл `79991234567` → стало `+79991234567`.
  - Ввёл `9991234567` → стало `+79991234567` (так как 10 цифр без «7»/«8» воспринимаем как «без кода»? Здесь развилка — см. ниже).

- **Развилка на 10-значном вводе без префикса:** строго говоря, `9991234567` не однозначен. Простой и предсказуемый вариант — **всегда** добавлять только «+» (без манипуляций с «7»/«8», кроме классической «8 в начале → 7»). То есть `9991234567` → `+9991234567`, а не `+79991234567`. Это уважает иностранные номера и не угадывает за пользователя.
- **Финальная логика:** «+» автоподставляется в начале; «8» в первой позиции конвертируется в «7» (только если это первая цифра — классический российский кейс). Всё остальное — как ввёл пользователь.
- **Курсор:** в react-input без библиотек простая нормализация в `onChange` может прыгать курсором. Допускаем чуть менее идеальное UX (курсор уходит в конец при префиксации «+»). Если будет жалоба — добавлю `useRef` с `selectionStart`/`selectionEnd` восстановлением.
- **Валидация:** `validateField("phoneNumber", ...)` сейчас требует ≥7 цифр — НЕ трогаем.
- **Acceptance:** ввод любого из `8XXX...`, `7XXX...`, `+7XXX...`, `XXX...` приводит к корректному отображению с «+» в начале и «7» вместо «8».

### Страницы поверх формы

#### Edit 9. «Скачайте шаблон оформления статьи и подготовьте рукопись по нему» → сократить
- **Файл:** `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx:44`.
- **Изменение:** «Скачайте шаблон оформления статьи и подготовьте рукопись по нему.» → «Скачайте шаблон оформления статей.»
- **Скоуп:** только эта страница. Аналогичная фраза в `SubmissionForm.tsx:129` НЕ меняется (заказчик о ней не просил).
- **Acceptance:** на `/authors/submission` плашка с шаблоном содержит сокращённый текст.

#### Edit 10. «Сервис подачи статей» → внутренняя ссылка на `/authors/submit`
- **Файлы:**
  - `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx:51-58` («сервис подачи статей» — внешний `https://ms.questionset.ru/`).
  - `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx:114` («онлайн-сервис подачи статей» — `https://ms.questionset.ru`).
  - `02_src/vte-frontend/src/app/(public)/authors/review/page.tsx:65-72` («сервис подачи статей» — `https://ms.questionset.ru/`).
- **Изменение:** заменить внешний `<a href="https://ms.questionset.ru/" target="_blank" ...>` на внутренний `<Link href="/authors/submit" className="...">` (без `target="_blank"`, без `rel`).
- **Скоуп EN:** EN-версии страниц (`SubmissionEn`, `ReviewEn`) **НЕ трогаем** — `/authors/submit` на EN рендерит fallback и заказчик про EN не упоминал.
- **Acceptance:** на `/authors/submission` и `/authors/review` (RU) ссылки «сервис подачи статей» / «онлайн-сервис подачи статей» ведут на `/authors/submit` в той же вкладке.

#### Edit REFERENCES. Заменить блок «Версии оформления русскоязычных публикаций для списка REFERENCES»
- **Файл:** `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx:134-139` (внутри `SubmissionRu`).
- **Текущее:** 5 примеров без `(In Russ.).` в конце.
- **Замена 1-к-1** (заголовок остаётся «Версии оформления русскоязычных публикаций для списка REFERENCES:»):

  1. _Andreeva E.L., Polkova T.V._ (2014). Assessment of the Quality of Working Life of the Population of Russian Regions // _Regional Economy._ No. 3(35). Pp. 91–101. DOI: 10.17059/2013-3-7. (In Russ.).
  2. _Kolosova R.P., Baimurzina G.R._ (2021). Decent Work in the New Conditions: Updating the Indicators of the Quality of Employment / _Transformation of the Labor Market and Employment Policy: Coll. of the IV Int. scient.-pract. conf. «Kostinsky Readings»_, Moscow, 11.02.2021. — M.: Academy of Labor and Social Relations. Pp. 15–20. (In Russ.).
  3. _Lapin N.I._ (2021). _The Complexity of the Formation of a New Russia. An Anthroposociocultural Approach._ — M.: Ves` Mir. (In Russ.).
  4. _MOT_ (2008). _Measuring Decent Work Based on the Recommendations of the Tripartite Meeting of Experts on Measuring Decent Work_ (September 2008). URL: https://www.ilo.org/wcmsp5/groups/public/---dgreports/---integration/documents/meetingdocument/wcms_192844.pdf (access date: 12.07.2025). (In Russ.).
  5. _Precarious employment in the Russian Federation: theory and methodology of identification, assessment and vector of reduction_ (2018). / Ed. V.N. Bobkov. — M.: KNORUS. (In Russ.).

- **Скоуп EN:** EN-страница не содержит блока REFERENCES — не трогаем.
- **Acceptance:** на `/authors/submission` (RU) в секции «3. Пристатейный библиографический список» блок REFERENCES содержит 5 указанных записей с `(In Russ.).` в конце каждой.

## 3. Что НЕ меняется

- Контракт API submitManuscript.
- Структура form state (`SubmissionFormState`).
- Регулярка ORCID (`ORCID_RE`).
- Регулярка/валидация email/phone (кроме нормализации ввода).
- EN-версии страниц submission/review.
- Любая фраза в `SubmissionForm.tsx:129` (плашка над формой) — заказчик не просил.
- Чекбокс `consentAgreement` в `ConsentsBlock` — заказчик не просил.
- Honeypot, error_type guard и прочие защитные механизмы.

## 4. Архитектурные решения

- **DeclarationsBlock label → ReactNode.** Изменить тип `label: string` на `label: ReactNode` в массиве `ITEMS`. Это даёт возможность вставить `<Link>` в любой пункт без новой инфраструктуры.
- **Phone normalize helper.** Положить функцию `normalizePhoneInput(input: string): string` рядом с другими утилитами (например, `lib/validation/submission.ts` или новый `lib/format/phone.ts`). Решение по итогам — выбираю `lib/format/phone.ts`, чтобы не мешать validation/format. Тестируется отдельно.
- **Drop-zone без error-стиля.** Стилистический патч одной строки `className`. Без перепроектирования компонента.
- **Bug 1 (сброс полей при загрузке).** Сначала repro, потом фикс. Без repro в спеку не пишу гипотез — определю при имплементации.

## 5. Тестирование

- **Юниты:**
  - `normalizePhoneInput` — таблица входов/выходов (`""`, `"8"`, `"89991234567"`, `"79991234567"`, `"+79991234567"`, `"9991234567"`, `"+38099..."`, мусор с буквами).
- **UI smoke (Chrome DevTools MCP, локально против staging-backend):**
  - Bug 1: заполнил все поля → загрузил docx → поля сохранены.
  - п.2: клик по «авторского соглашения» в декларациях → открывается `/authors/copyright-agreement`.
  - п.3: label = «Почта».
  - п.4: submit пустой формы → drop-zone остался нейтральным, под ним красный текст.
  - п.5: placeholder ORCID без `X`.
  - п.6: все 4 поля блока содержат «(соавторов через запятую)».
  - п.7: под заголовком «Контакты…» виден description.
  - п.9: на странице submission плашка с сокращённым текстом.
  - п.10: клик по «сервис подачи статей» на submission и review → переход на `/authors/submit`.
  - п.11: ввод `89991234567` → отображается `+79991234567`.
  - REFERENCES: блок содержит 5 новых записей с `(In Russ.).`.
- **QA-сессия:** один файл в `00_docs/qa/sessions/` по шаблону, с результатами по каждому пункту.

## 6. Релизный план

- **Версия:** `0.1.16` (бамп с `0.1.15`).
- **Деплой:** docker build/push после явного «закончили правки» от заказчика. Не раньше.
