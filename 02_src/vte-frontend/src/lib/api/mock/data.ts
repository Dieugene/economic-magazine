import type {
  Author,
  Section,
  ArticleSummary,
  ArticleFull,
  IssueSummary,
  IssueFull,
  EditorialBoardMember,
  Reference,
  SectionSlug,
  ArticleType,
} from '@/lib/types';

// ── Sections ──────────────────────────────────────────────────────

export const sections: Section[] = [
  { slug: 'economic-theory', name: { ru: 'Экономическая теория', en: 'Economic Theory' } },
  { slug: 'methodology', name: { ru: 'Методология экономической науки', en: 'Methodology of Economics' } },
  { slug: 'theory-to-policy', name: { ru: 'От теории к экономической политике', en: 'From Theory to Economic Policy' } },
  { slug: 'history-of-thought', name: { ru: 'История мысли', en: 'History of Thought' } },
  { slug: 'interdisciplinary', name: { ru: 'Междисциплинарные исследования', en: 'Interdisciplinary Studies' } },
  { slug: 'economic-history', name: { ru: 'Экономическая история', en: 'Economic History' } },
  { slug: 'reviews', name: { ru: 'Обзоры и рецензии', en: 'Reviews' } },
];

function sectionBySlug(slug: SectionSlug): Section {
  return sections.find((s) => s.slug === slug)!;
}

// ── Helper to create authors ────────────────────────────────────

function author(id: number, nameRu: string, affiliationRu: string, opts?: { email?: string; orcid?: string; nameEn?: string; affiliationEn?: string }): Author {
  return {
    id,
    full_name: { ru: nameRu, ...(opts?.nameEn ? { en: opts.nameEn } : {}) },
    affiliation: { ru: affiliationRu, ...(opts?.affiliationEn ? { en: opts.affiliationEn } : {}) },
    email: opts?.email ?? null,
    orcid: opts?.orcid ?? null,
  };
}

// ── Authors: 2026 №1 ────────────────────────────────────────────

const authorsArticle1: Author[] = [
  author(1, 'А.Я. Рубинштейн', 'ФГБУН Институт экономики РАН, Москва, Россия', { email: 'arubin@aha.ru', orcid: '0000-0003-0455-3879', nameEn: 'A.Ya. Rubinstein', affiliationEn: 'Institute of Economics of the Russian Academy of Sciences, Moscow, Russia' }),
  author(2, 'Е.Э. Чуковская', 'АНО ДПО «Научно-образовательный центр интеллектуальной собственности и цифровой экономики», Москва, Россия', { email: 'echukovskaya@yandex.ru', orcid: '0000-0002-2715-761X', nameEn: 'E.E. Chukovskaya', affiliationEn: 'Scientific and Educational Centre for Intellectual Property and Digital Economy, Moscow, Russia' }),
];
const authorsArticle2: Author[] = [author(3, 'Н.В. Комаровская', 'МГУ им. М.В. Ломоносова, Москва, Россия')];
const authorsArticle3: Author[] = [author(4, 'И.К. Капульцевич', 'НИУ ВШЭ, Москва, Россия')];
const authorsArticle4: Author[] = [author(5, 'А.С. Тишкин', 'РАНХиГС, Москва, Россия')];
const authorsArticle5: Author[] = [
  author(6, 'К.Э. Яновский', 'РАНХиГС, Москва, Россия'),
  author(7, 'С.В. Жаворонков', 'Институт экономической политики им. Е.Т. Гайдара, Москва, Россия'),
  author(8, 'И. Затковецкий', 'Университет Хайфы, Хайфа, Израиль'),
];
const authorsArticle6: Author[] = [
  author(9, 'М.Э. Дмитриев', 'Центр стратегических разработок, Москва, Россия'),
  author(10, 'А.А. Оконишников', 'Центр стратегических разработок, Москва, Россия'),
  author(11, 'А.Н. Семеняка', 'Центр стратегических разработок, Москва, Россия'),
];
const authorsArticle7: Author[] = [
  author(12, 'К.Ф. Быковский', 'НИУ ВШЭ, Москва, Россия'),
  author(13, 'Д.Д. Карташев', 'НИУ ВШЭ, Москва, Россия'),
];
const authorsArticle8: Author[] = [author(14, 'О.Н. Борох', 'Институт Дальнего Востока РАН, Москва, Россия')];
const authorsArticle9: Author[] = [author(15, 'А.Н. Медушевский', 'НИУ ВШЭ, Москва, Россия')];
const authorsArticle10: Author[] = [author(16, 'Ю.А. Нисневич', 'НИУ ВШЭ, Москва, Россия')];
const authorsArticle11: Author[] = [author(17, 'С.А. Васильев', 'Фонд «Либеральная миссия», Москва, Россия')];
const authorsArticle12: Author[] = [author(18, 'О.А. Кислицына', 'Институт экономики РАН, Москва, Россия')];

// ── References for article 1 ────────────────────────────────────

export const referencesArticle1: Reference[] = [
  { id: 1, order: 1, text_ru: 'Рубинштейн А.Я. Теория опекаемых благ. СПб.: Алетейя, 2018.', text_en: 'Rubinstein A.Ya. Theory of Patronized Goods. St. Petersburg: Aletheia, 2018.' },
  { id: 2, order: 2, text_ru: 'Полтерович В.М. Позитивное сотрудничество: факторы и механизмы эволюции // Вопросы экономики. 2016. № 11. С. 5–23.', text_en: 'Polterovich V.M. Positive Collaboration: Factors and Mechanisms of Evolution // Voprosy Ekonomiki. 2016. No. 11. Pp. 5–23.' },
  { id: 3, order: 3, text_ru: 'Дасгупта П. Экономический прогресс и идея социального капитала // Экономический вестник. 2004. Т. 3, № 2. С. 36–54.', text_en: 'Dasgupta P. Economic Progress and the Idea of Social Capital // Economic Bulletin. 2004. Vol. 3, No. 2. Pp. 36–54.' },
  { id: 4, order: 4, text_ru: 'Макаров В.Л. Экономика знаний: уроки для России // Вестник Российской академии наук. 2003. Т. 73, № 5. С. 450–456.', text_en: 'Makarov V.L. Knowledge Economy: Lessons for Russia // Herald of the Russian Academy of Sciences. 2003. Vol. 73, No. 5. Pp. 450–456.' },
  { id: 5, order: 5, text_ru: 'Merton R.K. The Sociology of Science: Theoretical and Empirical Investigations. Chicago: University of Chicago Press, 1973.', text_en: 'Merton R.K. The Sociology of Science: Theoretical and Empirical Investigations. Chicago: University of Chicago Press, 1973.' },
  { id: 6, order: 6, text_ru: 'David P.A. The Economic Logic of "Open Science" and the Balance between Private Property Rights and the Public Domain in Scientific Data and Information // Stanford Working Paper. 2003. No. 02-30.', text_en: 'David P.A. The Economic Logic of "Open Science" and the Balance between Private Property Rights and the Public Domain in Scientific Data and Information // Stanford Working Paper. 2003. No. 02-30.' },
  { id: 7, order: 7, text_ru: 'Hess C., Ostrom E. Understanding Knowledge as a Commons: From Theory to Practice. Cambridge, MA: MIT Press, 2007.', text_en: 'Hess C., Ostrom E. Understanding Knowledge as a Commons: From Theory to Practice. Cambridge, MA: MIT Press, 2007.' },
];

// ── Article summaries builder ───────────────────────────────────

function makeArticle(
  id: number,
  titleRu: string,
  authors: Author[],
  sectionSlug: SectionSlug,
  pages: string,
  doi: string,
  issueId: number,
  issueYear: number,
  issueNumber: number,
  issueSeq: number,
  pdfSizeKb: number | null = null,
  articleType: ArticleType = 'scientific',
): ArticleSummary {
  const doiSuffix = doi.split('VTE_')[1];
  return {
    id,
    title: { ru: titleRu },
    authors,
    section: sectionBySlug(sectionSlug),
    pages,
    doi,
    pdf_url: doiSuffix ? `https://journals.rcsi.science/vte/article/download/${doiSuffix}/pdf` : null,
    pdf_size_kb: pdfSizeKb,
    abstract: null,
    article_type: articleType,
    issue_id: issueId,
    issue_year: issueYear,
    issue_number: issueNumber,
    issue_sequential_number: issueSeq,
  };
}

// ══════════════════════════════════════════════════════════════════
// ISSUE 1: 2026, №1 (30) — 12 articles, IDs 1-12
// ══════════════════════════════════════════════════════════════════

export const articleSummary1: ArticleSummary = {
  ...makeArticle(1, 'Научная деятельность в цифровую эпоху: производство и распространение знания', authorsArticle1, 'economic-theory', '7-21', '10.52342/2587-7666VTE_2026_1_7_21', 1, 2026, 1, 30, 188),
  abstract: {
    ru: 'В статье представлен анализ современной ситуации, сложившейся спустя 12 лет после передачи в 2013 г. академических институтов сначала в подчинение Федерального агентства научных организаций (ФАНО), а затем Министерства науки и высшего образования, обусловившей фактическую утрату Российской академией наук статуса самоуправляемой организации гражданского общества. Это не могло не отразиться на авторитете РАН. Основной акцент сделан на исследовании актуальных проблем деятельности экономических институтов РАН и связанных с ними вопросах авторского права.',
    en: 'The article presents an analysis of the current situation 12 years after the transfer in 2013 of academic institutions first to the Federal Agency for Scientific Organisations (FANO) and then to the Ministry of Science and Higher Education, which led to the Russian Academy of Sciences effectively losing its status as a self-governing civil society organization, which affected the authority of the RAS. The focus is on researching current problems in the activities of the RAS\'s economic institutions and related copyright issues.',
  },
};

export const articleSummary2: ArticleSummary = makeArticle(2, 'Неопределённость и экономическая активность: теоретические аспекты', authorsArticle2, 'economic-theory', '22-38', '10.52342/2587-7666VTE_2026_1_22_38', 1, 2026, 1, 30, 213);
export const articleSummary3: ArticleSummary = makeArticle(3, 'Культурная трансформация как объект институционального проектирования: теоретические основы и эмпирические возможности C-NUDGE моделирования', authorsArticle3, 'economic-theory', '39-53', '10.52342/2587-7666VTE_2026_1_39_53', 1, 2026, 1, 30, 257);
export const articleSummary4: ArticleSummary = makeArticle(4, 'Науковедческие подходы Т. Куна и И. Лакатоса в методологии экономической науки и их критика', authorsArticle4, 'methodology', '54-69', '10.52342/2587-7666VTE_2026_1_54_69', 1, 2026, 1, 30, 249);
export const articleSummary5: ArticleSummary = makeArticle(5, 'Пенсии от государства: польза не очевидна, вред очевиден', authorsArticle5, 'theory-to-policy', '70-91', '10.52342/2587-7666VTE_2026_1_70_91', 1, 2026, 1, 30, 512);
export const articleSummary6: ArticleSummary = makeArticle(6, 'Целевой жилищный капитал: социально ориентированный институциональный дизайн', authorsArticle6, 'theory-to-policy', '92-111', '10.52342/2587-7666VTE_2026_1_92_111', 1, 2026, 1, 30, 426);
export const articleSummary7: ArticleSummary = makeArticle(7, 'Образование и доход: парадоксы глобализации', authorsArticle7, 'theory-to-policy', '112-127', '10.52342/2587-7666VTE_2026_1_112_127', 1, 2026, 1, 30, 376);
export const articleSummary8: ArticleSummary = makeArticle(8, 'Китайское экономическое образование в период кампаний критики второй половины 1950-х годов', authorsArticle8, 'history-of-thought', '128-144', '10.52342/2587-7666VTE_2026_1_128_144', 1, 2026, 1, 30, 202);
export const articleSummary9: ArticleSummary = makeArticle(9, 'Добродетель и порок: этические кодексы маргинальных сообществ современной России (Часть 1)', authorsArticle9, 'interdisciplinary', '145-163', '10.52342/2587-7666VTE_2026_1_145_163', 1, 2026, 1, 30, 223);
export const articleSummary10: ArticleSummary = makeArticle(10, 'Мир демократического правления в начале XXI века', authorsArticle10, 'interdisciplinary', '164-188', '10.52342/2587-7666VTE_2026_1_164_188', 1, 2026, 1, 30, 399);
export const articleSummary11: ArticleSummary = makeArticle(11, 'Программы реформирования экономики и запуск экономических реформ в России', authorsArticle11, 'economic-history', '189-214', '10.52342/2587-7666VTE_2026_1_189_214', 1, 2026, 1, 30, 258);
export const articleSummary12: ArticleSummary = makeArticle(12, 'Искусственный интеллект в здравоохранении: «лекарство» или «яд»?', authorsArticle12, 'reviews', '215-227', '10.52342/2587-7666VTE_2026_1_215_227', 1, 2026, 1, 30, 183, 'book_review');

const issue1Articles: ArticleSummary[] = [
  articleSummary1, articleSummary2, articleSummary3, articleSummary4,
  articleSummary5, articleSummary6, articleSummary7, articleSummary8,
  articleSummary9, articleSummary10, articleSummary11, articleSummary12,
];

// ══════════════════════════════════════════════════════════════════
// ISSUE 2: 2025, №4 (29) — 12 articles, IDs 13-24
// ══════════════════════════════════════════════════════════════════

const art13: ArticleSummary = makeArticle(13, 'Благополучие, связанное с работой: концепция и методологические подходы к измерению', [
  author(19, 'И.В. Соболева', 'ФГБУН Институт экономики РАН, Москва, Россия', { email: 'irasobol@gmail.com', orcid: '0000-0002-3049-7789' }),
  author(20, 'Е.А. Черных', 'ФГБУН Институт экономики РАН, Москва, Россия', { email: 'chernykh.ekaterina108@gmail.com', orcid: '0000-0002-6970-487X' }),
], 'economic-theory', '7-19', '10.52342/2587-7666VTE_2025_4_7_19', 2, 2025, 4, 29, 182);

const art14: ArticleSummary = makeArticle(14, 'Реформы: фактор идеологии в свете российских научных публикаций', [
  author(21, 'В.В. Вольчик', 'Южный федеральный университет, Ростов-на-Дону, Россия', { email: 'volchik@sfedu.ru', orcid: '0000-0002-0027-3442' }),
  author(22, 'В.В. Кот', 'Южный федеральный университет, Ростов-на-Дону, Россия', { email: 'vkot@sfedu.ru', orcid: '0000-0002-6910-2086' }),
], 'economic-theory', '20-35', '10.52342/2587-7666VTE_2025_4_20_35', 2, 2025, 4, 29, 193);

const art15: ArticleSummary = makeArticle(15, 'Нужна ли новому мировому экономическому порядку новая экономическая теория?', [
  author(23, 'В.Л. Тамбовцев', 'МГУ им. М.В. Ломоносова, Москва, Россия'),
], 'methodology', '36-52', '10.52342/2587-7666VTE_2025_4_36_52', 2, 2025, 4, 29, 206);

const art16: ArticleSummary = makeArticle(16, 'Конкурирующие парадигмы в рамках современной политической экономии', [
  author(24, 'С.Н. Левин', 'Кемеровский государственный университет, Кемерово, Россия'),
  author(25, 'К.С. Саблин', 'Кемеровский государственный университет, Кемерово, Россия'),
], 'methodology', '53-67', '10.52342/2587-7666VTE_2025_4_53_67', 2, 2025, 4, 29, 360);

const art17: ArticleSummary = makeArticle(17, 'Оценка инфляционных ожиданий населения России на основе поисковых запросов в сети Интернет (подход «сверху вниз»)', [
  author(26, 'В.С. Щербаков', 'Москва, Россия'),
], 'theory-to-policy', '68-90', '10.52342/2587-7666VTE_2025_4_68_90', 2, 2025, 4, 29, 3100);

const art18: ArticleSummary = makeArticle(18, 'Р.М. Нуреев: от «политэкономии в широком смысле» к поиску институциональной «большой теории» экономической истории', [
  author(27, 'Г.Д. Гловели', 'Институт экономики РАН, Москва, Россия'),
  author(28, 'К.Э. Мерзликин', 'Институт экономики РАН, Москва, Россия'),
], 'history-of-thought', '91-104', '10.52342/2587-7666VTE_2025_4_91_104', 2, 2025, 4, 29, 417);

const art19: ArticleSummary = makeArticle(19, 'Исследование НТП и теорий технико-экономического развития в работах Ю.Я. Ольсевича', [
  author(29, 'Г.А. Маслов', 'Институт экономики РАН, Москва, Россия'),
], 'history-of-thought', '105-116', '10.52342/2587-7666VTE_2025_4_105_116', 2, 2025, 4, 29, 166);

const art20: ArticleSummary = makeArticle(20, 'Трансформация системы экономического образования в Китае (первая половина 1950-х годов)', [
  author(30, 'О.Н. Борох', 'Институт Дальнего Востока РАН, Москва, Россия'),
], 'history-of-thought', '117-132', '10.52342/2587-7666VTE_2025_4_117_132', 2, 2025, 4, 29, 194);

const art21: ArticleSummary = makeArticle(21, 'И доверие, и закон: как социальный капитал и формальные институты влияют на соблюдение ковидных ограничений', [
  author(31, 'А.П. Казун', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '133-143', '10.52342/2587-7666VTE_2025_4_133_143', 2, 2025, 4, 29, 248);

const art22: ArticleSummary = makeArticle(22, 'Влияние социального капитала на субъективное благополучие', [
  author(32, 'В.Н. Титов', 'Институт экономики РАН, Москва, Россия'),
  author(33, 'Д.М. Логинов', 'Институт экономики РАН, Москва, Россия'),
], 'interdisciplinary', '144-157', '10.52342/2587-7666VTE_2025_4_144_157', 2, 2025, 4, 29, 511);

const art23: ArticleSummary = makeArticle(23, 'Экономические реформы в России 90-х гг.: формирование команды и идеологии реформаторов', [
  author(34, 'С.А. Васильев', 'Фонд «Либеральная миссия», Москва, Россия'),
], 'economic-history', '158-179', '10.52342/2587-7666VTE_2025_4_158_179', 2, 2025, 4, 29, 236);

const art24: ArticleSummary = makeArticle(24, 'Российское общество и вызовы времени: десятилетие 2014–2024 гг. (новое исследование Института социологии РАН)', [
  author(35, 'Н.М. Плискевич', 'Институт экономики РАН, Москва, Россия'),
], 'reviews', '180-190', '10.52342/2587-7666VTE_2025_4_180_190', 2, 2025, 4, 29, 157, 'book_review');

const issue2Articles: ArticleSummary[] = [art13, art14, art15, art16, art17, art18, art19, art20, art21, art22, art23, art24];

// ══════════════════════════════════════════════════════════════════
// ISSUE 3: 2025, №3 (28) — 12 articles, IDs 25-36
// ══════════════════════════════════════════════════════════════════

const art25: ArticleSummary = makeArticle(25, 'Международная накопительная интеграция и оценка её экономических эффектов', [
  author(36, 'Б.А. Хейфец', 'Институт экономики РАН, Москва, Россия'),
  author(37, 'В.Ю. Чернова', 'Институт экономики РАН, Москва, Россия'),
], 'economic-theory', '7-24', '10.52342/2587-7666VTE_2025_3_7_24', 3, 2025, 3, 28);

const art26: ArticleSummary = makeArticle(26, 'Институт дотаций в России', [
  author(38, 'Я.В. Трофимова', 'Россия'),
], 'economic-theory', '25-37', '10.52342/2587-7666VTE_2025_3_25_37', 3, 2025, 3, 28);

const art27: ArticleSummary = makeArticle(27, 'Текст-как-данные: экономическая перспектива', [
  author(39, 'А.М. Либман', 'Берлинский свободный университет, Берлин, ФРГ'),
], 'methodology', '38-48', '10.52342/2587-7666VTE_2025_3_38_48', 3, 2025, 3, 28);

const art28: ArticleSummary = makeArticle(28, 'Почему россияне избегают медицинской помощи? (Социально-демографические детерминанты и причины избегающего поведения)', [
  author(40, 'О.А. Кислицына', 'Институт экономики РАН, Москва, Россия'),
], 'theory-to-policy', '49-64', '10.52342/2587-7666VTE_2025_3_49_64', 3, 2025, 3, 28);

const art29: ArticleSummary = makeArticle(29, 'Научные исследования в российских вузах: проблемы и региональные особенности', [
  author(41, 'Т.Л. Клячко', 'РАНХиГС, Москва, Россия'),
], 'theory-to-policy', '65-89', '10.52342/2587-7666VTE_2025_3_65_89', 3, 2025, 3, 28);

const art30: ArticleSummary = makeArticle(30, 'Экологическая политика принимающих экономик и мультинациональные корпорации: эмпирический анализ', [
  author(42, 'М.А. Юревич', 'Институт экономики РАН, Москва, Россия'),
  author(43, 'А.А. Федюнина', 'НИУ ВШЭ, Москва, Россия'),
], 'theory-to-policy', '90-104', '10.52342/2587-7666VTE_2025_3_90_104', 3, 2025, 3, 28);

const art31: ArticleSummary = makeArticle(31, 'Не всё то золото, что в БС', [
  author(44, 'А.Л. Зюбина', 'Россия'),
], 'theory-to-policy', '105-118', '10.52342/2587-7666VTE_2025_3_105_118', 3, 2025, 3, 28);

const art32: ArticleSummary = makeArticle(32, 'Международное правосудие в поисках равновесия между правом и политикой (Часть 2)', [
  author(45, 'А.Н. Медушевский', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '119-133', '10.52342/2587-7666VTE_2025_3_119_133', 3, 2025, 3, 28);

const art33: ArticleSummary = makeArticle(33, 'Коммуникация в контексте политической символизации: от дискурсов к речевым ситуациям', [
  author(46, 'Г.И. Мусихин', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '134-143', '10.52342/2587-7666VTE_2025_3_134_143', 3, 2025, 3, 28);

const art34: ArticleSummary = makeArticle(34, 'Инфляция, экономия и онлайн-покупки: потребительское поведение россиян в первой половине 2020-х годов', [
  author(47, 'Д.М. Логинов', 'Институт экономики РАН, Москва, Россия'),
  author(48, 'Т.М. Малева', 'РАНХиГС, Москва, Россия'),
], 'interdisciplinary', '144-158', '10.52342/2587-7666VTE_2025_3_144_158', 3, 2025, 3, 28);

const art35: ArticleSummary = makeArticle(35, 'Хозяйственная деятельность ордена тамплиеров', [
  author(49, 'А.В. Ковалёв', 'Россия'),
], 'economic-history', '159-167', '10.52342/2587-7666VTE_2025_3_159_167', 3, 2025, 3, 28);

const art36: ArticleSummary = makeArticle(36, 'В продолжение дискуссии о первопричинах устойчивого экономического роста (О книге Й. Стейнссона)', [
  author(50, 'А.А. Мальцев', 'Уральский федеральный университет, Екатеринбург, Россия'),
  author(51, 'С.В. Чичилимов', 'Уральский федеральный университет, Екатеринбург, Россия'),
], 'reviews', '168-178', '10.52342/2587-7666VTE_2025_3_168_178', 3, 2025, 3, 28, null, 'book_review');

const issue3Articles: ArticleSummary[] = [art25, art26, art27, art28, art29, art30, art31, art32, art33, art34, art35, art36];

// ══════════════════════════════════════════════════════════════════
// ISSUE 4: 2025, №2 (27) — minimal entry, no articles detail
// ══════════════════════════════════════════════════════════════════

// (no articles scraped for this issue)

// ══════════════════════════════════════════════════════════════════
// ISSUE 5: 2025, №1 (26) — 12 articles, IDs 37-48
// ══════════════════════════════════════════════════════════════════

const art37: ArticleSummary = makeArticle(37, 'Экономический смысл и прикладное значение индикаторов удовлетворённости жизнью', [
  author(52, 'О.Н. Антипина', 'МГУ им. М.В. Ломоносова, Москва, Россия'),
  author(53, 'Н.А. Миклашевская', 'МГУ им. М.В. Ломоносова, Москва, Россия'),
  author(54, 'Е.А. Орлова', 'МГУ им. М.В. Ломоносова, Москва, Россия'),
], 'economic-theory', '7-22', '10.52342/2587-7666VTE_2025_1_7_22', 5, 2025, 1, 26);

const art38: ArticleSummary = makeArticle(38, 'Специфика российских институтов и патернализм государства (Часть 1. Государство в узком и широком смысле)', [
  author(55, 'Н.М. Плискевич', 'Институт экономики РАН, Москва, Россия'),
], 'economic-theory', '23-36', '10.52342/2587-7666VTE_2025_1_23_36', 5, 2025, 1, 26);

const art39: ArticleSummary = makeArticle(39, 'Экономико-правовое пространство теневой экономики', [
  author(56, 'Е.В. Батурина', 'Россия'),
], 'theory-to-policy', '37-50', '10.52342/2587-7666VTE_2025_1_37_50', 5, 2025, 1, 26);

const art40: ArticleSummary = makeArticle(40, 'Определяя неопределённость', [
  author(57, 'Н.В. Комаровская', 'МГУ им. М.В. Ломоносова, Москва, Россия'),
], 'history-of-thought', '51-64', '10.52342/2587-7666VTE_2025_1_51_64', 5, 2025, 1, 26);

const art41: ArticleSummary = makeArticle(41, 'Маффео Панталеони: либеральный экономист и кризис либерального государства в Италии', [
  author(58, 'Д.В. Мельник', 'Россия'),
], 'history-of-thought', '65-78', '10.52342/2587-7666VTE_2025_1_65_78', 5, 2025, 1, 26);

const art42: ArticleSummary = makeArticle(42, 'Мир авторитарного правления в начале XXI века (Часть 1)', [
  author(59, 'Ю.А. Нисневич', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '79-92', '10.52342/2587-7666VTE_2025_1_79_92', 5, 2025, 1, 26);

const art43: ArticleSummary = makeArticle(43, 'Жизненный успех: что он означает для россиян?', [
  author(60, 'Н.Е. Тихонова', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '93-112', '10.52342/2587-7666VTE_2025_1_93_112', 5, 2025, 1, 26);

const art44: ArticleSummary = makeArticle(44, 'Социальная активность российской молодёжи: концептуально-психологические факторы', [
  author(61, 'П.А. Ефимова', 'НИУ ВШЭ, Москва, Россия'),
  author(62, 'З.Х. Лепшокова', 'НИУ ВШЭ, Москва, Россия'),
  author(63, 'А.Г. Яшина', 'НИУ ВШЭ, Москва, Россия'),
  author(64, 'Е.В. Попов', 'НИУ ВШЭ, Москва, Россия'),
  author(65, 'А.С. Титов', 'НИУ ВШЭ, Москва, Россия'),
], 'interdisciplinary', '113-126', '10.52342/2587-7666VTE_2025_1_113_126', 5, 2025, 1, 26);

const art45: ArticleSummary = makeArticle(45, 'Справедливое социальное государство как ценность и как реальность для российских граждан (Часть 2. Принципы справедливости в социальном государстве)', [
  author(66, 'В.Л. Римский', 'Россия'),
], 'interdisciplinary', '127-146', '10.52342/2587-7666VTE_2025_1_127_146', 5, 2025, 1, 26);

const art46: ArticleSummary = makeArticle(46, 'Государственное регулирование занятости женщин и профессиональная сегрегация в российской сфере труда — 100 лет истории (Часть 3. 1992–2024 гг.)', [
  author(67, 'М.Е. Баскакова', 'Россия'),
], 'economic-history', '147-166', '10.52342/2587-7666VTE_2025_1_147_166', 5, 2025, 1, 26);

const art47: ArticleSummary = makeArticle(47, 'Экономика Севастополя в 1920-е гг.: от политики «военного коммунизма» к нэпу', [
  author(68, 'А.Г. Баранов', 'Севастополь, Россия'),
  author(69, 'Е.П. Гармашова', 'Севастополь, Россия'),
  author(70, 'Т.А. Лопатина', 'Севастополь, Россия'),
  author(71, 'Д.В. Пунга', 'Севастополь, Россия'),
], 'economic-history', '167-184', '10.52342/2587-7666VTE_2025_1_167_184', 5, 2025, 1, 26);

const art48: ArticleSummary = makeArticle(48, 'Нобелевская премия по экономике 2024 г. и перспективы институциональной экономики', [
  author(72, 'С.С. Винокуров', 'Россия'),
], 'reviews', '185-196', '10.52342/2587-7666VTE_2025_1_185_196', 5, 2025, 1, 26, null, 'book_review');

const issue5Articles: ArticleSummary[] = [art37, art38, art39, art40, art41, art42, art43, art44, art45, art46, art47, art48];

// ── All article summaries ───────────────────────────────────────

export const allArticleSummaries: ArticleSummary[] = [
  ...issue1Articles,
  ...issue2Articles,
  ...issue3Articles,
  ...issue5Articles,
];

// ── Full article data ───────────────────────────────────────────

export const articleFullData: ArticleFull = {
  ...articleSummary1,
  abstract: {
    ru: 'В статье представлен анализ современной ситуации, сложившейся спустя 12 лет после передачи в 2013 г. академических институтов сначала в подчинение Федерального агентства научных организаций (ФАНО), а затем Министерства науки и высшего образования, обусловившей фактическую утрату Российской академией наук статуса самоуправляемой организации гражданского общества. Это не могло не отразиться на авторитете РАН. Основной акцент сделан на исследовании актуальных проблем деятельности экономических институтов РАН и связанных с ними вопросах авторского права. В контексте поиска ответов на вопросы, относящиеся к научной деятельности и распространению знания, представлено мнение профессиональных экономистов, полученное в результате социологического интернет-исследования, выполненного на основе информационной системы НЭА. Важная особенность распространения знаний обусловлена проблемами интеллектуальной собственности и авторского права. Появление большого числа псевдо-произведений и объектов с невысоким уровнем творчества влияет и на рынок распространения знания. В условиях журнальной монополии, устанавливаемой в наукометрических целях, модели взаимоотношений учёных и издателей сегодня искажены по сравнению с принципиальными правовыми подходами, традиционно предоставляющими автору власть над результатом своего труда, право на его неприкосновенность и на вознаграждение. Использование новых технологий в научной деятельности несёт как преимущества, так и риски. С одной стороны, нейросеть в разы упрощает некоторые рутинные операции, тем самым являясь эффективным орудием интеллектуального труда на определённых этапах исследований. С другой стороны, не исключена подмена результатов человеческих умозаключений сгенерированными выводами алгоритма, базирующегося на принципах частотности словоупотребления и несвободного от недостатков. С позиций авторского права не решены вопросы «на входе» и «на выходе»: насколько легально использование охраняемых произведений для машинного обучения и кому должны принадлежать права на сгенерированный контент.',
    en: 'The article presents an analysis of the current situation 12 years after the transfer in 2013 of academic institutions first to the Federal Agency for Scientific Organisations (FANO) and then to the Ministry of Science and Higher Education, which led to the Russian Academy of Sciences effectively losing its status as a self-governing civil society organization, which affected the authority of the RAS. The focus is on researching current problems in the activities of the RAS\'s economic institutions and related copyright issues. In the context of seeking answers to questions related to scientific activity and the dissemination of knowledge, the opinion of professional economists is presented, obtained because of an online sociological survey conducted because of the NEA information system. An important feature of the dissemination of knowledge is conditioned by issues of intellectual property and copyright. The emergence of many pseudo-works and objects with a low level of creativity also affects the market for the dissemination of knowledge. In the context of a journal monopoly established for scientometric purposes, the models of relations between scientists and publishers today are distorted compared to fundamental legal approaches that traditionally give authors power over the results of their work, the right to inviolability and the right to remuneration. The use of new technologies in scientific activity carries both advantages and risks. Neural networks greatly simplify some routine operations, thus being an effective tool for intellectual work at certain stages of research. On the other hand, there is a possibility that the results of human reasoning will be replaced by conclusions generated by an algorithm based on the principles of word frequency and not free from flaws. From the point of view of copyright, the issues of \'input\' and \'output\' remain unresolved: to what extent is the use of protected works for machine learning legal, and who should own the rights to the generated content?',
  },
  keywords: {
    ru: ['социологические исследования', 'распространение знания', 'интеллектуальная собственность', 'авторские права', 'нейросети', 'ранжирование журналов', 'рейтинг'],
    en: ['sociological research', 'knowledge dissemination', 'intellectual property', 'copyright', 'neural networks', 'journal ranking', 'rating'],
  },
  udk: '330.1',
  jel_codes: ['A11', 'D83', 'O33'],
  references: referencesArticle1,
  received_date: '2025-11-18',
  accepted_date: '2026-01-20',
  funding: {
    ru: 'Исследование выполнено при финансовой поддержке Министерства науки и высшего образования Российской Федерации в рамках государственного задания Института экономики РАН.',
    en: 'The study was financially supported by the Ministry of Science and Higher Education of the Russian Federation within the state assignment of the Institute of Economics RAS.',
  },
  xml_url: 'https://journals.rcsi.science/vte/article/view/2026_1_7_21/xml',
};

// Full article data for Soboleva/Chernykh (2025 №4, article 13)
export const articleFullData13: ArticleFull = {
  ...art13,
  abstract: {
    ru: 'Показано, что сегодня в условиях усложнения социально-трудовых отношений традиционные индикаторы, фокусирующиеся на соответствии параметров рабочих мест установленным стандартам в области доходов и рамочных условий занятости, в недостаточной степени отражают многоплановые реалии этого положения и возникает запрос на переосмысление методологии его оценки. Выявлены сильные и слабые стороны подходов с позиций концепций качества занятости и субъективного благополучия, сделан вывод о необходимости интегративного подхода, учитывающего как объективные параметры занятости, так и их соответствие индивидуальным предпочтениям и потребностям работников. Рассмотрены теоретические модели, разработанные в русле интегративного подхода, такие как модель «требования – ресурсы», модель «витаминов», а также подход с точки зрения возможностей, открытых для индивида в сфере занятости, опирающийся на концепцию функциональных возможностей А. Сена. На основе обобщения этих моделей обоснована целесообразность оценки положения человека в сфере труда с опорой на концепцию благополучия, связанного с работой. Показано, что эта концепция вбирает в себя как объективные параметры качества трудовой жизни и инструментальной полезности занятости, так и самооценку работниками своей ситуации в сфере труда и позволяет оценить соответствие индивидуальных характеристик работников и требований рабочих мест. Акцентируется важность встраивания в методологический аппарат элементов концепции адаптивной рационализации, согласно которой обладатели объективно неблагоприятных рабочих мест могут воспринимать свою занятость как приемлемую, что искажает реальную картину их благополучия. Предлагается методология построения профилей благополучия, связанного с работой, основанная на поаспектном сопоставлении его объективных и субъективных микроуровневых индикаторов.',
  },
  keywords: {
    ru: ['благополучие связанное с работой', 'качество занятости', 'субъективное благополучие', 'удовлетворённость работой', 'интегративный подход', 'адаптивная рационализация', 'индикаторы благополучия'],
    en: ['work-related well-being', 'quality of employment', 'subjective well-being', 'job satisfaction', 'integrative approach', 'adaptive rationalization', 'well-being indicators'],
  },
  udk: null,
  jel_codes: ['J28', 'J81', 'I31'],
  references: undefined,
  received_date: '2025-08-10',
  accepted_date: '2025-10-15',
  funding: null,
  xml_url: 'https://journals.rcsi.science/2587-7666/article/xml/353792',
};

// Full article data for Volchik/Kot (2025 №4, article 14)
export const articleFullData14: ArticleFull = {
  ...art14,
  abstract: {
    ru: 'В статье исследуется влияние идеологии на осмысление в экономической науке процессов социальных и экономических преобразований на основе качественного анализа наиболее цитируемых статей российских экономистов в научной электронной библиотеке eLIBRARY.RU за период 1992–2025 гг. В данной статье мы основываемся на тезисах, выдвинутых известным российским экономистом В.М. Полтеровичем, об отрицательном влиянии идеологий на разработку стратегий реформ в «догоняющих странах», и о том, что следование доминирующей идеологии уводит от новейших достижений экономической науки. Анализ научных статей на предмет подтверждения данных тезисов проводился поэтапно по периодам 1992–1997 гг., 1998–2002 гг., 2003–2007 гг., 2008–2012 гг., 2013–2017 гг. и 2018–2025 гг. Тезис о системной ограниченности идеологически детерминированных реформ приводит к одностороннему пониманию экономических процессов и нарушению комплексного подхода к регулированию. На примере Китая показан альтернативный подход, где прагматичная идеология сыграла ключевую роль в успешном проведении рыночных реформ без применения шоковой терапии, с сохранением управляемости.',
  },
  keywords: {
    ru: ['идеология', 'экономические реформы', 'экономическая наука', 'экономическая политика', 'китайский опыт реформ'],
    en: ['ideology', 'economic reforms', 'economic science', 'economic policy', 'Chinese experience of reform'],
  },
  udk: null,
  jel_codes: ['B41', 'P21', 'P30'],
  references: undefined,
  received_date: '2025-07-20',
  accepted_date: '2025-10-01',
  funding: {
    ru: 'Российский научный фонд № 24-18-00665, «Идеологический ландшафт российской экономической науки» в Южном федеральном университете.',
    en: 'Russian Science Foundation No. 24-18-00665, "Ideological landscape of Russian economic science" at Southern Federal University.',
  },
  xml_url: 'https://journals.rcsi.science/2587-7666/article/xml/353802',
};

// ── Generic full data for other articles ────────────────────────

function summaryAsFullArticle(summary: ArticleSummary): ArticleFull {
  return {
    ...summary,
    keywords: undefined,
    udk: null,
    jel_codes: undefined,
    references: undefined,
    received_date: null,
    accepted_date: null,
    funding: null,
    xml_url: null,
  };
}

// ── Issues ──────────────────────────────────────────────────────

export const issueSummary1: IssueSummary = {
  id: 1,
  year: 2026,
  number: 1,
  sequential_number: 30,
  published_date: '2026-02-27',
  cover_url: '/covers/vte_2026_1.jpg',
  full_pdf_url: 'https://journals.rcsi.science/vte/issue/download/2026_1/full.pdf',
  status: 'published',
  article_count: 12,
};

export const issueSummary2: IssueSummary = {
  id: 2,
  year: 2025,
  number: 4,
  sequential_number: 29,
  published_date: '2025-11-10',
  cover_url: '/covers/vte_2025_4.jpg',
  full_pdf_url: 'https://questionset.ru/files/arch/2025/2025-N4/VTE_2025_4.pdf',
  status: 'published',
  article_count: 12,
};

export const issueSummary3: IssueSummary = {
  id: 3,
  year: 2025,
  number: 3,
  sequential_number: 28,
  published_date: '2025-08-20',
  cover_url: '/covers/vte_2025_3.jpg',
  full_pdf_url: 'https://questionset.ru/files/arch/2025/2025-N3/VTE_2025_3.pdf',
  status: 'published',
  article_count: 12,
};

export const issueSummary4: IssueSummary = {
  id: 4,
  year: 2025,
  number: 2,
  sequential_number: 27,
  published_date: '2025-05-15',
  cover_url: '/covers/vte_2025_2.jpg',
  full_pdf_url: 'https://questionset.ru/files/arch/2025/2025-N2/VTE_2025_2.pdf',
  status: 'published',
  article_count: 10,
};

export const issueSummary5: IssueSummary = {
  id: 5,
  year: 2025,
  number: 1,
  sequential_number: 26,
  published_date: '2025-02-20',
  cover_url: '/covers/vte_2025_1.jpg',
  full_pdf_url: 'https://questionset.ru/files/arch/2025/2025-N1/VTE_2025_1.pdf',
  status: 'published',
  article_count: 12,
};

// ── Issue full data (with sections) ─────────────────────────────

function groupBySection(articles: ArticleSummary[]): IssueFull['sections'] {
  const sectionOrder: SectionSlug[] = ['economic-theory', 'methodology', 'theory-to-policy', 'history-of-thought', 'interdisciplinary', 'economic-history', 'reviews'];
  const grouped = new Map<SectionSlug, ArticleSummary[]>();
  for (const a of articles) {
    const slug = a.section.slug;
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push(a);
  }
  return sectionOrder
    .filter((slug) => grouped.has(slug))
    .map((slug) => ({ section: sectionBySlug(slug), articles: grouped.get(slug)! }));
}

export const issueFullData1: IssueFull = { ...issueSummary1, sections: groupBySection(issue1Articles) };
export const issueFullData2: IssueFull = { ...issueSummary2, sections: groupBySection(issue2Articles) };
export const issueFullData3: IssueFull = { ...issueSummary3, sections: groupBySection(issue3Articles) };
export const issueFullData4: IssueFull = { ...issueSummary4, sections: [] }; // minimal, no articles
export const issueFullData5: IssueFull = { ...issueSummary5, sections: groupBySection(issue5Articles) };

// Backward-compatible aliases
export const issueSummary = issueSummary1;
export const issueFullData = issueFullData1;

// ── Years & issues-by-year ──────────────────────────────────────

export const issueYears: number[] = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

const allIssues: IssueSummary[] = [issueSummary1, issueSummary2, issueSummary3, issueSummary4, issueSummary5];

const issueFullMap: Record<number, IssueFull> = {
  1: issueFullData1,
  2: issueFullData2,
  3: issueFullData3,
  4: issueFullData4,
  5: issueFullData5,
};

export const issuesByYear: IssueSummary[] = allIssues;

// ── Editorial board ─────────────────────────────────────────────

export const editorialBoard: EditorialBoardMember[] = [
  { id: 1, full_name: { ru: 'В.С. Автономов' }, role: 'Член редколлегии', degree: { ru: 'член-корреспондент РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», профессор' }, email: 'vavtonomov@hse.ru', spin_code: '6086-8715', orcid: '0000-0001-8169-729X', scopus_id: null, order: 1 },
  { id: 2, full_name: { ru: 'О.И. Ананьин' }, role: 'Член редколлегии', degree: { ru: 'канд. экон. наук, профессор' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор' }, email: 'ananyin@hse.ru', spin_code: '9967-2838', orcid: '0000-0001-7380-290X', scopus_id: null, order: 2 },
  { id: 3, full_name: { ru: 'М.Р. Байсингер' }, role: 'Член редколлегии', degree: { ru: 'д-р полит. наук, профессор (США)' }, affiliation: { ru: 'Принстонский университет (США), директор Принстонского института международных и региональных исследований' }, email: 'mbeissin@princeton.edu', spin_code: null, orcid: '0000-0001-7937-2277', scopus_id: '6603181314', order: 3 },
  { id: 4, full_name: { ru: 'А.Е. Варшавский' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Центральный экономико-математический институт РАН, заведующий лабораторией моделирования экономической стабильности' }, email: 'varshavae@yandex.ru', spin_code: '7987-6250', orcid: '0000-0001-8229-3692', scopus_id: null, order: 4 },
  { id: 5, full_name: { ru: 'М.И. Воейков' }, role: 'Зам. гл. редактора', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, главный научный сотрудник' }, email: 'mvok1943@mail.ru', spin_code: '5900-2420', orcid: '0000-0002-3873-8276', scopus_id: null, order: 5 },
  { id: 6, full_name: { ru: 'Г.Д. Гловели' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, руководитель Центра методологических и историко-экономических исследований' }, email: 'glovelig@mail.ru', spin_code: '6514-1027', orcid: '0000-0001-7871-6533', scopus_id: null, order: 6 },
  { id: 7, full_name: { ru: 'Р.С. Гринберг' }, role: 'Член редколлегии', degree: { ru: 'член-корреспондент РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, научный руководитель Института экономики РАН' }, email: 'grinberg@inecon.ru', spin_code: null, orcid: null, scopus_id: '55999922800', order: 7 },
  { id: 8, full_name: { ru: 'В.Е. Дементьев' }, role: 'Член редколлегии', degree: { ru: 'член-корреспондент РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Центральный экономико-математический институт РАН, руководитель научного направления, зам. председателя Ученого совета ЦЭМИ РАН' }, email: 'dementev@cemi.rssi.ru', spin_code: '9399-5255', orcid: '0000-0001-5612-3999', scopus_id: null, order: 8 },
  { id: 9, full_name: { ru: 'А.П. Заостровцев' }, role: 'Зам. гл. редактора', degree: { ru: 'канд. экон. наук, доцент' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики» (Санкт-Петербург), профессор' }, email: 'zao-and@yandex.ru', spin_code: '2198-0122', orcid: '0000-0003-0302-4182', scopus_id: null, order: 9 },
  { id: 10, full_name: { ru: 'Л.В. Зеленоборская' }, role: 'Член редколлегии', degree: { ru: 'канд. экон. наук' }, affiliation: { ru: 'Институт экономики РАН, ученый секретарь Института экономики РАН' }, email: 'lvz@inecon.ru', spin_code: null, orcid: null, scopus_id: null, order: 10 },
  { id: 11, full_name: { ru: 'Р.И. Капелюшников' }, role: 'Член редколлегии', degree: { ru: 'член-корреспондент РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Институт мировой экономики и международных отношений им. Е.М. Примакова РАН, главный научный сотрудник' }, email: 'rostis@hse.ru', spin_code: '1189-1604', orcid: '0000-0002-2312-2110', scopus_id: null, order: 11 },
  { id: 12, full_name: { ru: 'С.Г. Кирдина-Чэндлер' }, role: 'Член редколлегии', degree: { ru: 'д-р социол. наук' }, affiliation: { ru: 'Институт экономики РАН, главный научный сотрудник, заведующая сектором институционально-эволюционной экономики' }, email: 'kirdina@inecon.ru', spin_code: '2262-1600', orcid: '0000-0002-9234-8308', scopus_id: null, order: 12 },
  { id: 13, full_name: { ru: 'А.М. Либман' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор (ФРГ)' }, affiliation: { ru: 'Берлинский свободный университет, профессор' }, email: 'alexander.libman@fu-berlin.de', spin_code: '5378-4313', orcid: '0000-0001-8504-3007', scopus_id: null, order: 13 },
  { id: 14, full_name: { ru: 'В.И. Маевский' }, role: 'Член редколлегии', degree: { ru: 'академик РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, руководитель Центра институционально-эволюционной экономики и прикладных проблем воспроизводства' }, email: 'maev1941@bk.ru', spin_code: '7212-8734', orcid: '0000-0003-4169-825X', scopus_id: null, order: 14 },
  { id: 15, full_name: { ru: 'Н.А. Макашева' }, role: 'Зам. гл. редактора', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Институт информации по общественным наукам РАН, главный научный сотрудник' }, email: 'nmakasheva@mail.ru', spin_code: '8991-0890', orcid: '0000-0002-3460-3040', scopus_id: null, order: 15 },
  { id: 16, full_name: { ru: 'В.С. Мартьянов' }, role: 'Член редколлегии', degree: { ru: 'канд. полит. наук, доцент' }, affiliation: { ru: 'Институт философии и права УрО РАН, директор' }, email: 'martianovy@rambler.ru', spin_code: '8770-5974', orcid: '0000-0002-7747-0022', scopus_id: null, order: 16 },
  { id: 17, full_name: { ru: 'В.Ю. Музычук' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, заместитель директора по научной работе' }, email: 'vm-instecon@yandex.ru', spin_code: '4161-3862', orcid: '0009-0008-7902-7228', scopus_id: null, order: 17 },
  { id: 18, full_name: { ru: 'А.Н. Олейник' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор (Канада)' }, affiliation: { ru: 'Университет «Мемориал» (Канада), профессор' }, email: 'aoleynik@mun.ca', spin_code: '3948-9729', orcid: '0000-0002-5229-1052', scopus_id: null, order: 18 },
  { id: 19, full_name: { ru: 'Н.М. Плискевич' }, role: 'Зам. гл. редактора', degree: { ru: '' }, affiliation: { ru: 'Институт экономики РАН, старший научный сотрудник' }, email: 'znplis@yandex.ru', spin_code: '1479-1879', orcid: '0000-0003-0860-6229', scopus_id: null, order: 19 },
  { id: 20, full_name: { ru: 'Л.И. Полищук' }, role: 'Член редколлегии', degree: { ru: 'канд. экон. наук, доцент' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор' }, email: 'lpolish@iu.edu', spin_code: '1963-5472', orcid: null, scopus_id: null, order: 20 },
  { id: 21, full_name: { ru: 'В.М. Полтерович' }, role: 'Член редколлегии', degree: { ru: 'академик РАН, д-р экон. наук, профессор' }, affiliation: { ru: 'Центральный экономико-математический институт РАН, заведующий лабораторией математической экономики' }, email: 'polterov@mail.ru', spin_code: '2154-8463', orcid: '0000-0001-6092-6823', scopus_id: null, order: 21 },
  { id: 22, full_name: { ru: 'Т.Ф. Ремингтон' }, role: 'Член редколлегии', degree: { ru: 'PhD, канд. полит. наук (США)' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», Университет Эмори (Emory University, США), профессор' }, email: 'polstfr@emory.edu', spin_code: null, orcid: '0000-0002-1109-3121', scopus_id: null, order: 22 },
  { id: 23, full_name: { ru: 'А.Я. Рубинштейн' }, role: 'Член редколлегии', degree: { ru: 'д-р филос. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, главный научный сотрудник, руководитель научного направления «Теоретическая экономика»' }, email: 'arubin@aha.ru', spin_code: '9701-6884', orcid: '0000-0003-0455-3879', scopus_id: null, order: 23 },
  { id: 24, full_name: { ru: 'М.Е. Симон' }, role: 'Член редколлегии', degree: { ru: 'канд. полит. наук, доцент' }, affiliation: { ru: 'Российская академия народного хозяйства и государственной службы, ведущий научный сотрудник' }, email: 'mr.marksimon@gmail.com', spin_code: '6172-7029', orcid: null, scopus_id: null, order: 24 },
  { id: 25, full_name: { ru: 'Н.Е. Тихонова' }, role: 'Член редколлегии', degree: { ru: 'д-р социол. наук, профессор' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор' }, email: 'netichonova@gmail.com', spin_code: '1448-9948', orcid: '0000-0002-5826-4418', scopus_id: null, order: 25 },
  { id: 26, full_name: { ru: 'М.Ю. Урнов' }, role: 'Член редколлегии', degree: { ru: 'д-р полит. наук, профессор' }, affiliation: { ru: 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор' }, email: 'murnov@hse.ru', spin_code: '3716-9699', orcid: '0000-0003-3175-2064', scopus_id: null, order: 26 },
  { id: 27, full_name: { ru: 'Б.А. Хейфец' }, role: 'Член редколлегии', degree: { ru: 'д-р экон. наук, профессор' }, affiliation: { ru: 'Институт экономики РАН, главный научный сотрудник' }, email: 'bah412@rambler.ru', spin_code: '5873-3262', orcid: '0000-0002-6009-434X', scopus_id: null, order: 27 },
  { id: 28, full_name: { ru: 'Т.В. Чубарова' }, role: 'Зам. гл. редактора', degree: { ru: 'д-р экон. наук, доцент' }, affiliation: { ru: 'Институт экономики РАН, главный научный сотрудник' }, email: 't_chubarova@mail.ru', spin_code: '3367-5073', orcid: '0000-0002-3985-0198', scopus_id: null, order: 28 },
];

// ── Router ───────────────────────────────────────────────────────

const articleMap: Record<number, ArticleSummary> = Object.fromEntries(
  allArticleSummaries.map((a) => [a.id, a]),
);

const fullArticleMap: Record<number, ArticleFull> = {
  1: articleFullData,
  13: articleFullData13,
  14: articleFullData14,
};

export function getMockData(path: string): unknown {
  // Latest issue
  if (path === '/api/issues/latest/') return issueSummary1;

  // Years list
  if (path === '/api/issues/years/') return issueYears;

  // Issue by ID
  const issueByIdMatch = path.match(/^\/api\/issues\/(\d+)\/$/);
  if (issueByIdMatch) {
    const id = Number(issueByIdMatch[1]);
    return issueFullMap[id] ?? null;
  }

  // Issues by year
  const yearMatch = path.match(/\/api\/issues\/\?year=(\d+)/);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    return allIssues.filter((i) => i.year === year);
  }

  // All issues
  if (path === '/api/issues/') return allIssues;

  // Full article (check full map first, then generic)
  const articleMatch = path.match(/^\/api\/articles\/(\d+)\/$/);
  if (articleMatch) {
    const id = Number(articleMatch[1]);
    if (fullArticleMap[id]) return fullArticleMap[id];
    const summary = articleMap[id];
    return summary ? summaryAsFullArticle(summary) : null;
  }

  // Sections list
  if (path === '/api/sections/') return sections;

  // Section articles
  const sectionMatch = path.match(/^\/api\/sections\/([^/]+)\/articles\//);
  if (sectionMatch) {
    const slug = sectionMatch[1];
    const results = allArticleSummaries.filter((a) => a.section.slug === slug);
    return { count: results.length, results };
  }

  // Editorial board
  if (path === '/api/editorial-board/') return editorialBoard;

  // Search
  const searchMatch = path.match(/[?&]q=([^&]+)/);
  if (path.startsWith('/api/search/') && searchMatch) {
    const q = decodeURIComponent(searchMatch[1]).toLowerCase();
    const results = allArticleSummaries.filter(
      (a) =>
        a.title.ru.toLowerCase().includes(q) ||
        a.authors.some((au) => au.full_name.ru.toLowerCase().includes(q)),
    );
    return { count: results.length, results };
  }

  console.warn(`[mock] No mock data for path: ${path}`);
  return null;
}
